import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function CreateUserSubscriptionPlansBotsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    // const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateUserSubscriptionPlansBotsLambdas', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    const AddDeleteContentPlanFromSubscriptionQueue = Queue.fromQueueArn(
        that,
        'imported-AddDeleteContentPlanFromSubscriptionQueue-ForCreateSubscriptionProcessor',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.AddDeleteContentPlanFromSubscriptionQueue.basicSQS_arn
    );

    const AddDeleteContentPlanFromSubscriptionQueueDLQ = Queue.fromQueueArn(
        that,
        'imported-AddDeleteContentPlanFromSubscriptionQueueDLQ-ForCreateSubscriptionProcessor',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.AddDeleteContentPlanFromSubscriptionQueue.dlqSQS_arn
    );

    //Вывод списка
    const ListUserSubscriptionPlansBotsLambda = new NodejsFunction(that, 'ListUserSubscriptionPlansBotsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'ListUserSubscriptionPlansLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansBot-List-Lambda',
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

    //Вывод одного элемента
    const GetSubscriptionPlanBotLambda = new NodejsFunction(that, 'GetSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'GetUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansBot-Get-Lambda',
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

    //Добавлении типа подписки
    const AddSubscriptionPlanBotLambda = new NodejsFunction(that, 'AddSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'AddUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansBot-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            AddDeleteContentPlanFromSubscriptionQueueURL: AddDeleteContentPlanFromSubscriptionQueue.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //редактирование опции оплаты
    const EditSubscriptionPlanBotLambda = new NodejsFunction(that, 'EditSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'EditUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansBot-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            AddDeleteContentPlanFromSubscriptionQueueURL: AddDeleteContentPlanFromSubscriptionQueue.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    const AddDeleteContentPlanFromSubscriptionLambda = new NodejsFunction(that, 'AddDeleteContentPlanFromSubscription', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionProcessor', 'AddDeleteContentPlanFromSubscription.ts'),
        handler: 'handler',
        functionName: 'react-AddDeleteContentPlanFromSubscriptionLambda-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    const eventSourceForAddDeleteContentPlanFromSubscriptionLambda = new SqsEventSource(AddDeleteContentPlanFromSubscriptionQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceForAddDeleteContentPlanFromSubscriptionLambdaDLQ = new SqsEventSource(AddDeleteContentPlanFromSubscriptionQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    AddDeleteContentPlanFromSubscriptionLambda.addEventSource(eventSourceForAddDeleteContentPlanFromSubscriptionLambda);
    AddDeleteContentPlanFromSubscriptionLambda.addEventSource(eventSourceForAddDeleteContentPlanFromSubscriptionLambdaDLQ);

    const DeleteSubscriptionPlanBotLambda = new NodejsFunction(that, 'DeleteSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'DeleteUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansBot-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            AddDeleteContentPlanFromSubscriptionQueueURL: AddDeleteContentPlanFromSubscriptionQueue.queueUrl,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //DeleteSubscriptionPlanBotLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);

    //разрешаем пушить лямбдам в очередь добавления контент планов
    // const statementSQStoAddContentPlanPost = new PolicyStatement({
    //     resources: [AddDeleteContentPlanFromSubscriptionQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    // DeleteSubscriptionPlanBotLambda.addToRolePolicy(statementSQStoAddContentPlanPost);
    // AddSubscriptionPlanBotLambda.addToRolePolicy(statementSQStoAddContentPlanPost);
    // EditSubscriptionPlanBotLambda.addToRolePolicy(statementSQStoAddContentPlanPost);

    // GrantAccessToDDB(
    //     [
    //         ListUserSubscriptionPlansBotsLambda,
    //         AddSubscriptionPlanBotLambda,
    //         EditSubscriptionPlanBotLambda,
    //         DeleteSubscriptionPlanBotLambda,
    //         GetSubscriptionPlanBotLambda,
    //         AddDeleteContentPlanFromSubscriptionLambda
    //     ],
    //     tables
    // );

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListUserSubscriptionPlansBotsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetSubscriptionPlanBotLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddSubscriptionPlanBotLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditSubscriptionPlanBotLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteSubscriptionPlanBotLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
