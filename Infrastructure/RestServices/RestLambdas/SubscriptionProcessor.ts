import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToS3, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DeduplicationScope, FifoThroughputLimit, Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamoEventSource, SqsDlq, SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function CreateSubscriptionProcessor(that: any, layers: ILayerVersion[], tables: ITable[]) {
    const expireSubscriptionQueue = Queue.fromQueueArn(
        that,
        'imported-expireSubscriptionQueue-ForCreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.expireSubscriptionQueue.basicSQS_arn
    );

    const expireSubscriptionQueueDLQ = Queue.fromQueueArn(
        that,
        'imported-expireSubscriptionQueueDLQ-ForCreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.expireSubscriptionQueue.dlqSQS_arn
    );

    const SendMessageSchedulerQueueSecond = Queue.fromQueueArn(
        that,
        'imported-SendMessageSchedulerQueueSecondForCreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SendMessageSchedulerQueue.Second.basicSQS_arn
    );

    const SubscribeToSubscriptionPlanQueue = Queue.fromQueueArn(
        that,
        'imported-SubscribeToSubscriptionPlanQueue-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.SubscribeToSubscriptionPlanQueue.basicSQS_arn
    );

    const SubscribeToSubscriptionPlanQueueDLQ = Queue.fromQueueArn(
        that,
        'imported-SubscribeToSubscriptionPlanQueueDLQ-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.SubscribeToSubscriptionPlanQueue.dlqSQS_arn
    );

    const SubscribeToContentPlanQueue = Queue.fromQueueArn(
        that,
        'imported-SubscribeToContentPlanQueue-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.SubscribeToContentPlanQueue.basicSQS_arn
    );

    const SubscribeToContentPlanQueueDLQ = Queue.fromQueueArn(
        that,
        'imported-SubscribeToContentPlanQueueDLQ-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.SubscriptionProcessorQueue.SubscribeToContentPlanQueue.dlqSQS_arn
    );

    const AddScheduledPostQueue = Queue.fromQueueArn(
        that,
        'imported-PostScheduler-AddScheduledPostQueue-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.AddPost.basicSQS_arn
    );

    const AddScheduledPostQueueDLQ = Queue.fromQueueArn(
        that,
        'imported-PostScheduler-AddScheduledPostQueueDLQ-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.AddPost.dlqSQS_arn
    );

    const DeleteScheduledPostQueue = Queue.fromQueueArn(
        that,
        'imported-PostScheduler-DeleteScheduledPostQueue-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.DeletePost.basicSQS_arn
    );

    const DeleteScheduledPostQueueDLQ = Queue.fromQueueArn(
        that,
        'imported-PostScheduler-DeleteScheduledPostQueueDLQ-CreateSubscriptionProcessor',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.DeletePost.dlqSQS_arn
    );

    const SubscriptionProcessorAddScheduledPostLambda = new NodejsFunction(that, 'SubscriptionProcessorAddScheduledPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'AddScheduledPost.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Scheduler-Add-New-Post',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        memorySize: 256,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            SendMessageSchedulerQueueSecondURL: SendMessageSchedulerQueueSecond.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const SubscriptionProcessorDeleteScheduledPostLambda = new NodejsFunction(that, 'SubscriptionProcessorDeleteScheduledPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'DeleteScheduledPost.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Scheduler-Delete-Post',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        memorySize: 256,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            SendMessageSchedulerQueueSecond: SendMessageSchedulerQueueSecond.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const AddScheduledPostEvent = new SqsEventSource(AddScheduledPostQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const AddScheduledPostEventDLQ = new SqsEventSource(AddScheduledPostQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SubscriptionProcessorAddScheduledPostLambda.addEventSource(AddScheduledPostEvent);
    SubscriptionProcessorAddScheduledPostLambda.addEventSource(AddScheduledPostEventDLQ);

    const DeleteScheduledPostEvent = new SqsEventSource(DeleteScheduledPostQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const DeleteScheduledPostEventDLQ = new SqsEventSource(DeleteScheduledPostQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SubscriptionProcessorDeleteScheduledPostLambda.addEventSource(DeleteScheduledPostEvent);
    SubscriptionProcessorDeleteScheduledPostLambda.addEventSource(DeleteScheduledPostEventDLQ);

    //Лямбда - принимает сообщение с планом подписки и выполняет его обработку
    const SubscriptionProcessorContentPlanLambda = new NodejsFunction(that, 'SubscriptionProcessorLambdaContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'SubscribeUserToContentPlan.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Subscribe-User-To-ContentPlan',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        environment: {
            SendMessageSchedulerQueueSecondURL: SendMessageSchedulerQueueSecond.queueUrl,
            SubscribeToContentPlanQueueURL: SubscribeToContentPlanQueue.queueUrl,
            SubscribeToSubscriptionPlanQueueURL: SubscribeToSubscriptionPlanQueue.queueUrl,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const SubscriptionProcessorSubscriptionPlanLambda = new NodejsFunction(that, 'SubscriptionProcessorSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'SubscribeUserToSubscriptionPlan.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Subscribe-User-To-SubscriptionPlan',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        environment: {
            SendMessageSchedulerQueueSecondURL: SendMessageSchedulerQueueSecond.queueUrl,
            SubscribeToContentPlanQueueURL: SubscribeToContentPlanQueue.queueUrl,
            SubscribeToSubscriptionPlanQueueURL: SubscribeToSubscriptionPlanQueue.queueUrl,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const statementSQS = new PolicyStatement({
        resources: [SendMessageSchedulerQueueSecond.queueArn],
        actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        effect: Effect.ALLOW
    });

    SubscriptionProcessorContentPlanLambda.addToRolePolicy(statementSQS);
    SubscriptionProcessorSubscriptionPlanLambda.addToRolePolicy(statementSQS);

    const subscriptionEvent = new SqsEventSource(SubscribeToSubscriptionPlanQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const subscriptionEventDLQ = new SqsEventSource(SubscribeToSubscriptionPlanQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SubscriptionProcessorSubscriptionPlanLambda.addEventSource(subscriptionEvent);
    SubscriptionProcessorSubscriptionPlanLambda.addEventSource(subscriptionEventDLQ);

    const contentEventDLQ = new SqsEventSource(SubscribeToContentPlanQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const contentEvent = new SqsEventSource(SubscribeToContentPlanQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SubscriptionProcessorContentPlanLambda.addEventSource(contentEvent);
    SubscriptionProcessorContentPlanLambda.addEventSource(contentEventDLQ);

    const expiteChannelSubscriptionLambda = new NodejsFunction(that, 'expiteChannelSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'expiteChannelSubscriptionLambda.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Expire-ChannelSubsriptions',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            expireSubscriptionQueueURL: expireSubscriptionQueue.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventRuleChannels: events.Rule = new events.Rule(that, 'oneHourExpireChannelSubscription', {
        schedule: events.Schedule.rate(Duration.hours(1)),
        ruleName: 'oneHourExpireChannelSubscription'
    });

    eventRuleChannels.addTarget(
        new targets.LambdaFunction(expiteChannelSubscriptionLambda, {
            event: events.RuleTargetInput.fromObject({ message: 'Hello Lambda' })
        })
    );
    targets.addLambdaPermission(eventRuleChannels, expiteChannelSubscriptionLambda);

    const expiteBotSubscriptionLambda = new NodejsFunction(that, 'expiteBotSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'expiteBotSubscriptionLambda.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Expire-BotSubscriptions',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            expireSubscriptionQueueURL: expireSubscriptionQueue.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventRuleBots: events.Rule = new events.Rule(that, 'oneHourExpireBotSubscription', {
        schedule: events.Schedule.rate(Duration.hours(1)),
        ruleName: 'oneHourExpireBotSubscription'
    });

    eventRuleBots.addTarget(
        new targets.LambdaFunction(expiteBotSubscriptionLambda, {
            event: events.RuleTargetInput.fromObject({ message: 'Hello Lambda' })
        })
    );
    targets.addLambdaPermission(eventRuleBots, expiteBotSubscriptionLambda);

    const statementSQSexpireSubscriptionQueue = new PolicyStatement({
        resources: [expireSubscriptionQueue.queueArn],
        actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        effect: Effect.ALLOW
    });

    expiteBotSubscriptionLambda.addToRolePolicy(statementSQSexpireSubscriptionQueue);
    expiteChannelSubscriptionLambda.addToRolePolicy(statementSQSexpireSubscriptionQueue);

    const ZuzonaSubscriptionCleanUpProcessor = new NodejsFunction(that, 'ZuzonaSubscriptionCleanUpProcessor', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'ZuzonaSubscriptionCleanUpProcessor.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Cleanup-Zuzona',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventRuleZuzona: events.Rule = new events.Rule(that, 'oneHourCleanupZuzona', {
        schedule: events.Schedule.rate(Duration.hours(24)),
        ruleName: 'oneHourCleanupZuzona'
    });

    eventRuleZuzona.addTarget(
        new targets.LambdaFunction(ZuzonaSubscriptionCleanUpProcessor, {
            event: events.RuleTargetInput.fromObject({ message: 'oneHourCleanupZuzona' })
        })
    );
    targets.addLambdaPermission(eventRuleZuzona, ZuzonaSubscriptionCleanUpProcessor);

    const expireUserSubscriptionItemLambda = new NodejsFunction(that, 'expireUserSubscriptionItem', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'expireUserSubscriptionItem.ts'),
        handler: 'handler',
        functionName: 'subscriptionProcessor-Expire-expireUserSubscriptionItem',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SMALL,
        reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const expireSubscriptionItemEvent = new SqsEventSource(expireSubscriptionQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const expireSubscriptionItemEventDLQ = new SqsEventSource(expireSubscriptionQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    expireUserSubscriptionItemLambda.addEventSource(expireSubscriptionItemEvent);
    expireUserSubscriptionItemLambda.addEventSource(expireSubscriptionItemEventDLQ);

    GrantAccessToDDB(
        [
            SubscriptionProcessorContentPlanLambda,
            SubscriptionProcessorSubscriptionPlanLambda,
            ZuzonaSubscriptionCleanUpProcessor,
            SubscriptionProcessorAddScheduledPostLambda,
            SubscriptionProcessorDeleteScheduledPostLambda,
            expireUserSubscriptionItemLambda,
            expiteBotSubscriptionLambda,
            expiteChannelSubscriptionLambda
        ],
        tables
    );
    // GrantAccessToS3([SubscriptionProcessorLambda], [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]);
}
