import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function CreateNotificationsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз
    const notificationsQueue = Queue.fromQueueArn(that, 'imported-notificationsQueue-ForCreateNotificationsLambdas', DynamicEnvironment.SQS.notificationsQueue.basicSQS_arn);

    const notificationsQueueDLQ = Queue.fromQueueArn(that, 'imported-notificationsQueueDLQ-ForCreateNotificationsLambdas', DynamicEnvironment.SQS.notificationsQueue.dlqSQS_arn);

    //вывод список опций оплаты
    const ListNewNotificationsLambda = new NodejsFunction(that, 'ListNewNotificationsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Notifications', 'ListNotificationsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Notifications-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    const AddNotificationLambda = new NodejsFunction(that, 'AddNotificationLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Notifications', 'AddNotificationLambda.ts'),
        handler: 'handler',
        functionName: 'react-Notifications-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    const eventSourceAddNotification = new SqsEventSource(notificationsQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceAddNotificationDLQ = new SqsEventSource(notificationsQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    AddNotificationLambda.addEventSource(eventSourceAddNotification);
    AddNotificationLambda.addEventSource(eventSourceAddNotificationDLQ);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListNewNotificationsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });

    return returnArray;
}
