import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { PolicyStatement, Effect, IRole } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export function CreateDigitalStoreCategories(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз
    // const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateDigitalStoreCategories', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    //Вывод списка
    const ListDigitalStoreCategoriesLambda = new NodejsFunction(that, 'ListDigitalStoreCategoriesLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'ListDigitalStoreCategoriesLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-List-Lambda',
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
    const GetDigitalStoreCategoryLambda = new NodejsFunction(that, 'GetDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'GetDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Get-Lambda',
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

    //Добавление
    const AddDigitalStoreCategoryLambda = new NodejsFunction(that, 'AddDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'AddDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Add-Lambda',
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

    //редактирование
    const EditDigitalStoreCategoryLambda = new NodejsFunction(that, 'EditDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'EditDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Edit-Lambda',
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

    //удаление
    const DeleteDigitalStoreCategoryLambda = new NodejsFunction(that, 'DeleteDigitalStoreCategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'DigitalStore', 'Category', 'DeleteDigitalStoreCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-DigitalStoreCategories-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //DeleteDigitalStoreCategoryLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);

    //предоставление доступа

    // GrantAccessToDDB([ListDigitalStoreCategoriesLambda, AddDigitalStoreCategoryLambda, EditDigitalStoreCategoryLambda, DeleteDigitalStoreCategoryLambda, GetDigitalStoreCategoryLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListDigitalStoreCategoriesLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetDigitalStoreCategoryLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddDigitalStoreCategoryLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditDigitalStoreCategoryLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteDigitalStoreCategoryLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
