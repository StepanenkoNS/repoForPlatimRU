import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function SendMessageScheduler(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    const SendMessageSchedulerQueueFirstDLQ = Queue.fromQueueArn(
        that,
        'imported-SendMessageSchedulerQueueFirstDLQ-forSendMessageScheduler',
        DynamicEnvironment.SQS.SendMessageSchedulerQueue.First.dlqSQS_arn
    );

    const SendMessageSchedulerQueueFirst = Queue.fromQueueArn(
        that,
        'imported-SendMessageSchedulerQueueFirst-forSendMessageScheduler',
        DynamicEnvironment.SQS.SendMessageSchedulerQueue.First.basicSQS_arn
    );

    const SendMessageSchedulerQueueSecondDLQ = Queue.fromQueueArn(
        that,
        'imported-SendMessageSchedulerQueueSecondDLQ-forSendMessageScheduler',
        DynamicEnvironment.SQS.SendMessageSchedulerQueue.Second.dlqSQS_arn
    );

    const SendMessageSchedulerQueueSecond = Queue.fromQueueArn(
        that,
        'imported-SendMessageSchedulerQueueSecond-forSendMessageScheduler',
        DynamicEnvironment.SQS.SendMessageSchedulerQueue.Second.basicSQS_arn
    );

    //Первая Лямбда - вызывется EB раз минуту и собирает зашедуленные сообщения для последующей отправки
    const SendMessageSchedullerFirstStageLambda = new NodejsFunction(that, 'SendMessage-Scheduller-First-Stage', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'SendMessage-Scheduller-First-Stage.ts'),
        handler: 'handler',
        functionName: 'SendMessage-Scheduller-First-Stage',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            SendMessageSchedulerQueueFirstURL: SendMessageSchedulerQueueFirst.queueUrl,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventRuleSendMessages: events.Rule = new events.Rule(that, 'oneMinuteSendMessageSchedullerFirstStage', {
        schedule: events.Schedule.rate(Duration.minutes(1)),
        ruleName: 'oneMinuteSendMessageSchedullerFirstStage',
        enabled: true
    });

    eventRuleSendMessages.addTarget(
        new targets.LambdaFunction(SendMessageSchedullerFirstStageLambda, {
            event: events.RuleTargetInput.fromObject({ message: 'SendMessageSchedullerFirstStageLambda' })
        })
    );
    targets.addLambdaPermission(eventRuleSendMessages, SendMessageSchedullerFirstStageLambda);

    //разрешаем пушить первой лямбде в следующую очередь во флоу
    // const statementSQSforFirstLambda = new PolicyStatement({
    //     resources: [SendMessageSchedulerQueueFirst.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    // SendMessageSchedullerFirstStageLambda.addToRolePolicy(statementSQSforFirstLambda);

    //Вторая Лямбда - получает из SQS батч с сообщениями в разрезе бот/пользователей и процессит дальше
    const SendMessageSchedullerSecondStageLambda = new NodejsFunction(that, 'SendMessage-Scheduller-Second-Stage', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'SendMessage-Scheduller-Second-Stage.ts'),
        handler: 'handler',
        functionName: 'SendMessage-Scheduller-Second-Stage',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            SendMessageSchedulerQueueFirstURL: SendMessageSchedulerQueueFirst.queueUrl,
            SendMessageSchedulerQueueSecondURL: SendMessageSchedulerQueueSecond.queueUrl,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    // //разрешаем пушить второй лямбде во вторую очередь
    // const statementSQSforSecondLamda = new PolicyStatement({
    //     resources: [SendMessageSchedulerQueueSecond.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    // SendMessageSchedullerSecondStageLambda.addToRolePolicy(statementSQSforSecondLamda);

    //добавляем для второй лямбды event sourcing, ссылающийся на первую очередь
    const eventSourceForSecondStageLambda = new SqsEventSource(SendMessageSchedulerQueueFirst, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceForSecondStageLambdaDLQ = new SqsEventSource(SendMessageSchedulerQueueFirstDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SendMessageSchedullerSecondStageLambda.addEventSource(eventSourceForSecondStageLambda);
    SendMessageSchedullerSecondStageLambda.addEventSource(eventSourceForSecondStageLambdaDLQ);

    //Лямбда - отправляющаяя сообщения в TG
    const SendMessageSender = new NodejsFunction(that, 'SendMessageSender', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'SendMessageSender.ts'),
        handler: 'handler',
        functionName: 'scheduler-SendMessageSender-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        //reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventSourceForSenderStageLambda = new SqsEventSource(SendMessageSchedulerQueueSecond, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceForSenderStageLambdaDLQ = new SqsEventSource(SendMessageSchedulerQueueSecondDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SendMessageSender.addEventSource(eventSourceForSenderStageLambda);
    SendMessageSender.addEventSource(eventSourceForSenderStageLambdaDLQ);

    // GrantAccessToDDB([SendMessageSchedullerFirstStageLambda, SendMessageSchedullerSecondStageLambda, SendMessageSender], tables);
}
