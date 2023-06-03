import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';

//@ts-ignore
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function CreateChannelsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    // const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateChannelsLambdas', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    //Вывод списка
    const ListChannelsLambda = new NodejsFunction(that, 'ListChannelsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'ListChannelsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Channels-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetChannelLambda = new NodejsFunction(that, 'GetChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'GetChannelLambda.ts'),
        handler: 'handler',
        functionName: 'react-Channels-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //редактирование опции оплаты
    const EditChannelLambda = new NodejsFunction(that, 'EditChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'EditChannelLambda.ts'),
        handler: 'handler',
        functionName: 'react-Channels-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление опции оплаты
    const DeleteChannelLambda = new NodejsFunction(that, 'DeleteChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'DeleteChannelLambda.ts'),
        handler: 'handler',
        functionName: 'react-Channels-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //DeleteChannelLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);

    ///////////миграция пользователей канала
    //очереди сообщений
    const migrateChannelFirstQueue = Queue.fromQueueArn(that, 'imported-migrateChannelFirstQueue-CreateChannelsLambdas', DynamicEnvironment.SQS.migrateChannelQueue.First.basicSQS_arn);
    const migrateChannelFirstQueueDLQ = Queue.fromQueueArn(that, 'imported-migrateChannelFirstQueueDLQ-CreateChannelsLambdas', DynamicEnvironment.SQS.migrateChannelQueue.First.dlqSQS_arn);

    const migrateChannelSecondQueue = Queue.fromQueueArn(that, 'imported-migrateChannelSecondQueue-CreateChannelsLambdas', DynamicEnvironment.SQS.migrateChannelQueue.Second.basicSQS_arn);
    const migrateChannelSecondQueueDLQ = Queue.fromQueueArn(that, 'imported-migrateChannelSecondQueueDLQ-CreateChannelsLambdas', DynamicEnvironment.SQS.migrateChannelQueue.Second.dlqSQS_arn);

    //очередь для отправки сообщений в ТГ о процессе
    const SendMessageSchedulerQueueSecond = Queue.fromQueueArn(that, 'imported-schedulerSendQueue-CreateChannelsLambdas', DynamicEnvironment.SQS.SendMessageSchedulerQueue.Second.basicSQS_arn);

    //очереди для upsert user
    const SubscribeToSubscriptionPlanQueue = Queue.fromQueueArn(
        that,
        'imported-SubscribeToSubscriptionPlanQueue-CreateChannelsLambdas',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.SubscribeToSubscriptionPlanQueue.basicSQS_arn
    );
    const SubscribeToContentPlanQueue = Queue.fromQueueArn(
        that,
        'imported-SubscribeToContentPlanQueue-CreateChannelsLambdas',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.SubscribeToContentPlanQueue.basicSQS_arn
    );
    //миграция канала - первая стадия опции оплаты
    const MigrateChannelFirstStageLambda = new NodejsFunction(that, 'MigrateChannelFirstStage', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'MigrateChannelFirstStage.ts'),
        handler: 'handler',
        functionName: 'react-Channels-Migrate-first',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            migrateChannelSecondQueueURL: migrateChannelSecondQueue.queueUrl,
            SendMessageSchedulerQueueSecondURL: SendMessageSchedulerQueueSecond.queueUrl,
            API_ID: StaticEnvironment.Secrets.API_ID,
            API_HASH: StaticEnvironment.Secrets.API_HASH
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    //миграция канала - первая стадия опции оплаты
    const MigrateChannelSecondStageLambda = new NodejsFunction(that, 'MigrateChannelSecondStage', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'MigrateChannelSecondStage.ts'),
        handler: 'handler',
        functionName: 'react-Channels-Migrate-second',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SMALL,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            SubscribeToSubscriptionPlanQueueURL: SubscribeToSubscriptionPlanQueue.queueUrl,
            SubscribeToContentPlanQueueURL: SubscribeToContentPlanQueue.queueUrl,
            SendMessageSchedulerQueueSecondURL: SendMessageSchedulerQueueSecond.queueUrl,
            API_ID: StaticEnvironment.Secrets.API_ID,
            API_HASH: StaticEnvironment.Secrets.API_HASH
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //ивент сорсинг для первой лямбды
    const eventSourceForFirstStageLambda = new SqsEventSource(migrateChannelFirstQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceForFirstStageLambdaDLQ = new SqsEventSource(migrateChannelFirstQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    MigrateChannelFirstStageLambda.addEventSource(eventSourceForFirstStageLambda);
    MigrateChannelFirstStageLambda.addEventSource(eventSourceForFirstStageLambdaDLQ);

    //ивент сорсинг для второй лямбды
    const eventSourceForSecondStageLambda = new SqsEventSource(migrateChannelSecondQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceForSecondStageLambdaDLQ = new SqsEventSource(migrateChannelSecondQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    MigrateChannelSecondStageLambda.addEventSource(eventSourceForSecondStageLambda);
    MigrateChannelSecondStageLambda.addEventSource(eventSourceForSecondStageLambdaDLQ);

    //разрешаем пушить первой лямбде в следующую очередь во флоу и отправлять сообщения назад в ТГ
    const statementSQSforFirstLambda = new PolicyStatement({
        resources: [SendMessageSchedulerQueueSecond.queueArn, migrateChannelSecondQueue.queueArn],
        actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        effect: Effect.ALLOW
    });

    //MigrateChannelFirstStageLambda.addToRolePolicy(statementSQSforFirstLambda);

    //разрешаем втрой лямбде очереди для UpsertBotUser первой лямбде в следующую очередь во флоу и отправлять сообщения назад в ТГ
    const statementSQSforSecondLambda = new PolicyStatement({
        resources: [SubscribeToSubscriptionPlanQueue.queueArn, SubscribeToContentPlanQueue.queueArn],
        actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        effect: Effect.ALLOW
    });

    //MigrateChannelSecondStageLambda.addToRolePolicy(statementSQSforSecondLambda);

    //SubscribeToSubscriptionPlanQueue

    // GrantAccessToDDB([ListChannelsLambda, EditChannelLambda, DeleteChannelLambda, GetChannelLambda, MigrateChannelFirstStageLambda, MigrateChannelSecondStageLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListChannelsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetChannelLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: EditChannelLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteChannelLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
