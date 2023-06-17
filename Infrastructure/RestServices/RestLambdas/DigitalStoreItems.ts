import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { PolicyStatement, Effect, IRole } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export function CreateDigitalStoreItems(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    // const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateDigitalStoreItems', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    //Вывод списка
    const ListDigitalStoreItemsLambda = new NodejsFunction(that, 'ListDigitalStoreItemsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Item', 'ListDigitalStoreItemsLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreItems-List-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Вывод списка
    const ListDigitalStoreItemsForContentPlanPostLambda = new NodejsFunction(that, 'ListDigitalStoreItemsForContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Item', 'ListDigitalStoreItemsForContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreItems-List-forContentPlanPost-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetDigitalStoreItemLambda = new NodejsFunction(that, 'GetDigitalStoreItemLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Item', 'GetDigitalStoreItemLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreItems-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Добавление
    const AddDigitalStoreItemLambda = new NodejsFunction(that, 'AddDigitalStoreItemLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Item', 'AddDigitalStoreItemLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreItems-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //редактирование
    const EditDigitalStoreItemLambda = new NodejsFunction(that, 'EditDigitalStoreItemLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Item', 'EditDigitalStoreItemLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreItems-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //удаление
    const DeleteDigitalStoreItemLambda = new NodejsFunction(that, 'DeleteDigitalStoreItemLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Item', 'DeleteDigitalStoreItemLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreItems-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //DeleteDigitalStoreItemLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);

    //предоставление доступа

    // GrantAccessToDDB(
    //     [ListDigitalStoreItemsLambda, AddDigitalStoreItemLambda, EditDigitalStoreItemLambda, DeleteDigitalStoreItemLambda, GetDigitalStoreItemLambda, ListDigitalStoreItemsForContentPlanPostLambda],
    //     tables
    // );

    const returnArray: LambdaAndResource[] = [];

    returnArray.push({
        lambda: ListDigitalStoreItemsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: ListDigitalStoreItemsForContentPlanPostLambda,
        resource: 'ListForPost',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: GetDigitalStoreItemLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddDigitalStoreItemLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditDigitalStoreItemLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteDigitalStoreItemLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
