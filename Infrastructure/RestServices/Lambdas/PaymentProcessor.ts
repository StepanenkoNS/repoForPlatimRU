import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToS3, ReturnGSIs } from '/opt/LambdaHelpers/AccessHelper';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DeduplicationScope, FifoThroughputLimit, Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamoEventSource, SqsDlq, SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function PaymentProcessor(that: any, layers: ILayerVersion[], tables: ITable[]) {
    const schedulerSendQueue = Queue.fromQueueArn(that, 'imported-schedulerSendQueueForPaymentProcessor', DynamicEnvironment.SQS.SchedulerQueue.basicSQS_arn);

    const paymentProcessorIncomingRequestQueueDLQ = Queue.fromQueueArn(that, 'imported-PaymentProcessorQueue', DynamicEnvironment.SQS.PaymentProcessorQueue.dlqSQS_arn);

    const paymentProcessorIncomingRequestQueue = Queue.fromQueueArn(that, 'imported-PaymentProcessorQueueDQL', DynamicEnvironment.SQS.PaymentProcessorQueue.basicSQS_arn);

    const paymentProcessorConfirmationQueueDLQ = Queue.fromQueueArn(that, 'imported-PaymentProcessorConfirmationQueue', DynamicEnvironment.SQS.PaymentProcessorConfirmationQueue.dlqSQS_arn);

    const paymentProcessorConfirmationQueue = Queue.fromQueueArn(that, 'imported-PaymentProcessorConfirmationQueueDQL', DynamicEnvironment.SQS.PaymentProcessorConfirmationQueue.basicSQS_arn);

    //Лямбда - принимает сообщение и запускает его обработку
    const paymentProcessorIncomingRequestsLambda = new NodejsFunction(that, 'paymentProcessorIncomingRequests', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentProcessor', 'IncomingPaymentRequests.ts'),
        handler: 'IncomingPaymentRequestsHandler',
        functionName: 'paymentProcessor-incomingRequests',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SMALL,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            schedulerSendQueue: schedulerSendQueue.queueUrl,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Лямбда - принимает подтверждение или отказ от админа и запускает его обработку
    const paymentProcessorincomingConfirmationRequestRequestsLambda = new NodejsFunction(that, 'paymentProcessorConfirmationRequests', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentProcessor', 'IncomingPaymentConfirmation.ts'),
        handler: 'IncomingPaymentConfirmationHandler',
        functionName: 'paymentProcessor-IncomingPaymentConfirmation',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SMALL,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            schedulerSendQueue: schedulerSendQueue.queueUrl,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const statementSQS = new PolicyStatement({
        resources: [
            paymentProcessorIncomingRequestQueueDLQ.queueArn,
            paymentProcessorIncomingRequestQueue.queueArn,
            paymentProcessorConfirmationQueueDLQ.queueArn,
            paymentProcessorConfirmationQueue.queueArn
        ],
        actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
        effect: Effect.ALLOW
    });

    paymentProcessorIncomingRequestsLambda.addToRolePolicy(statementSQS);
    paymentProcessorincomingConfirmationRequestRequestsLambda.addToRolePolicy(statementSQS);

    const eventSourceIncomingEvent = new SqsEventSource(paymentProcessorIncomingRequestQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceIncomingEventDlq = new SqsEventSource(paymentProcessorIncomingRequestQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceConfirmationEvent = new SqsEventSource(paymentProcessorConfirmationQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceConfirmationEventDlq = new SqsEventSource(paymentProcessorConfirmationQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    paymentProcessorIncomingRequestsLambda.addEventSource(eventSourceIncomingEvent);
    paymentProcessorIncomingRequestsLambda.addEventSource(eventSourceIncomingEventDlq);

    paymentProcessorincomingConfirmationRequestRequestsLambda.addEventSource(eventSourceConfirmationEvent);
    paymentProcessorincomingConfirmationRequestRequestsLambda.addEventSource(eventSourceConfirmationEventDlq);

    GrantAccessToDDB([paymentProcessorIncomingRequestsLambda, paymentProcessorincomingConfirmationRequestRequestsLambda], tables);
    GrantAccessToS3(
        [paymentProcessorIncomingRequestsLambda, paymentProcessorincomingConfirmationRequestRequestsLambda],
        [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]
    );
}
