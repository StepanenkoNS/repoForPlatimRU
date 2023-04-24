import { Duration } from 'aws-cdk-lib';
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

export function SendMessageScheduler(that: any, layers: ILayerVersion[], tables: ITable[]) {
    const schedulerSendQueueDLQ = Queue.fromQueueArn(that, 'imported-schedulerSendQueueDLQSendMessageScheduler', DynamicEnvironment.SQS.SchedulerQueue.dlqSQS_arn);

    const schedulerSendQueue = Queue.fromQueueArn(that, 'imported-schedulerSendQueueSendMessageScheduler', DynamicEnvironment.SQS.SchedulerQueue.basicSQS_arn);

    const schedulerDDBUpdateQueueDLQ = new Queue(that, 'scheduler-schedulerDDBUpdateQueueDLQ.fifo', {
        fifo: true,
        queueName: 'scheduler-schedulerDDBUpdateQueueDLQ.fifo',
        deduplicationScope: DeduplicationScope.MESSAGE_GROUP,
        fifoThroughputLimit: FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
        visibilityTimeout: Duration.seconds(900)
    });
    const schedulerDDBUpdateQueue = new Queue(that, 'scheduler-schedulerDDBUpdateQueue.fifo', {
        fifo: true,
        queueName: 'scheduler-schedulerDDBUpdateQueue.fifo',
        deduplicationScope: DeduplicationScope.MESSAGE_GROUP,
        fifoThroughputLimit: FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
        deadLetterQueue: {
            queue: schedulerDDBUpdateQueueDLQ,
            maxReceiveCount: 3
        },
        visibilityTimeout: Duration.seconds(900)
    });

    //Лямбда - раскидывает сообщения на 2 очереди: DDB и отправка
    const SendMessagePreProcessor = new NodejsFunction(that, 'SendMessagePreProcessor', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'SendMessagePreProcessor.ts'),
        handler: 'SendMessagePreProcessorHandler',
        functionName: 'scheduler-SendMessagePreProcessor-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        environment: {
            schedulerSendQueue: schedulerSendQueue.queueUrl,
            schedulerDDBUpdateQueue: schedulerDDBUpdateQueue.queueUrl,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Лямбда - вызываемая EB и запускающая процессинг
    const SendMessagescheduler = new NodejsFunction(that, 'SendMessagescheduler', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'SendMessageSchedulerLambda.ts'),
        handler: 'SendMessagesShedulerHandler',
        functionName: 'scheduler-ScheduleMessages-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        reservedConcurrentExecutions: 1,
        environment: {
            SendMessagePreProcessor: SendMessagePreProcessor.functionName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    SendMessagePreProcessor.grantInvoke(SendMessagescheduler);

    const statementSQS = new PolicyStatement({
        resources: [schedulerSendQueue.queueArn, schedulerDDBUpdateQueue.queueArn],
        actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        effect: Effect.ALLOW
    });

    SendMessagePreProcessor.addToRolePolicy(statementSQS);

    //Лямбда - отправляющаяя сообщения в TG
    const SendMessageSender = new NodejsFunction(that, 'SendMessageSender', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'SendMessageSender.ts'),
        handler: 'SendMessageSenderHandler',
        functionName: 'scheduler-SendMessageSender-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventSourceIncomingEvent = new SqsEventSource(schedulerSendQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceIncomingEventDlq = new SqsEventSource(schedulerSendQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    SendMessageSender.addEventSource(eventSourceIncomingEvent);
    SendMessageSender.addEventSource(eventSourceIncomingEventDlq);

    //Лямбда - обновляющая данные в DDB на INPROGRESS

    const sendMessageDDBUpdateInProgress = new NodejsFunction(that, 'SendMessageDDBUpdateInProgress', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessagescheduler', 'DDBUpdateInProgress.ts'),
        handler: 'DDBUpdateInProgressHandler',
        functionName: 'scheduler-DDBUpdateInProgress-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        reservedConcurrentExecutions: 1,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventSourceIncomingDDBEvent = new SqsEventSource(schedulerDDBUpdateQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceIncomingDDBEventDlq = new SqsEventSource(schedulerDDBUpdateQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    sendMessageDDBUpdateInProgress.addEventSource(eventSourceIncomingDDBEvent);
    sendMessageDDBUpdateInProgress.addEventSource(eventSourceIncomingDDBEventDlq);

    // const rule = new events.Rule(that, 'oneMinuteRule', {
    //     schedule: events.Schedule.cron({ minute: '0/1' })
    // });

    // const target = new targets.LambdaFunction(SendMessagescheduler);

    // rule.addTarget(target);

    // targets.addLambdaPermission(rule, SendMessagescheduler);

    // const DDBStreaming_SchdeduledMessages_dlqSQS = new Queue(that, 'DDBStreaming_ScheduledMessages_dlq', {
    //     queueName: 'DDBStreaming_ScheduledMessages_dlq'
    // });

    // const dlqschedulerSQS = new SqsDlq(DDBStreaming_SchdeduledMessages_dlqSQS);
    // const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
    // const botsTable = Table.fromTableAttributes(that, 'imported-BotsTable2', {
    //     tableArn: DynamicEnvironment.DynamoDbTables.botsTable.arn,
    //     globalIndexes: botsIndexes,
    //     tableStreamArn: DynamicEnvironment.DynamoDbTables.botsTable.streamARN
    // });
    // const DDBEventSourceBots = new DynamoEventSource(botsTable, {
    //     startingPosition: StartingPosition.TRIM_HORIZON,
    //     batchSize: 100,
    //     bisectBatchOnError: true,
    //     onFailure: dlqschedulerSQS,
    //     retryAttempts: 10,
    //     filters: [
    //         {
    //             pattern: JSON.stringify({
    //                 eventName: ['MODIFY'],
    //                 dynamodb: {
    //                     NewImage: {
    //                         GSI1PK: { S: ['INPROGRESS'] }
    //                     },
    //                     OldImage: {
    //                         GSI1PK: { S: ['SCHEDULED'] }
    //                     }
    //                 }
    //             })
    //         }
    //     ]
    // });

    // const lambdaDDBStreamProcessor = new NodejsFunction(that, 'scheduledMessagesStreamProcessor-Lambda', {
    //     entry: join(__dirname, '..', '..', '..', 'services', 'DDBStreaming', 'scheduledMessagesStreamProcessor.ts'),
    //     handler: 'scheduledMessagesStreamProcessor',
    //     functionName: 'scheduledMessagesStreamProcessor-Lambda',
    //     runtime: StaticEnvironment.LambdaSettinds.runtime,
    //     logRetention: StaticEnvironment.LambdaSettinds.logRetention,
    //     timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
    //     environment: {
    //         botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
    //         region: StaticEnvironment.GlobalAWSEnvironment.region,
    //         allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
    //         cookieDomain: StaticEnvironment.WebResources.mainDomainName,
    //         schedulerQueueURL: schedulledMessages_SQS.queueUrl,
    //         schedulerQueueARN: schedulledMessages_SQS.queueArn,
    //         ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
    //     },
    //     bundling: {
    //         externalModules: ['aws-sdk', '/opt/*']
    //     },
    //     layers: layers
    // });

    // lambdaDDBStreamProcessor.addToRolePolicy(statementSQS);

    // lambdaDDBStreamProcessor.addEventSource(DDBEventSourceBots);

    GrantAccessToDDB([SendMessagescheduler, SendMessagePreProcessor, SendMessagePreProcessor, sendMessageDDBUpdateInProgress, SendMessageSender], tables);
    GrantAccessToS3(
        [SendMessagescheduler, SendMessagePreProcessor, SendMessagePreProcessor, sendMessageDDBUpdateInProgress, SendMessageSender],
        [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]
    );
}
