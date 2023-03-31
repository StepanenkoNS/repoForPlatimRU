import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';

export function CreateFreePostsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListFreePostsResource = rootResource.addResource('List');
    const lambdaGetFreePostsResource = rootResource.addResource('Get');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaEdutFreePostsResource = rootResource.addResource('Edit');
    const lambdaDeleteFreePostsResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListFreePostsLambda = new NodejsFunction(that, 'ListFreePostsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'FreePosts', 'ListFreePostsLambda.ts'),
        handler: 'ListFreePostsHandler',
        functionName: 'react-FreePosts-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationListFreePosts = new apigateway.LambdaIntegration(ListFreePostsLambda);
    lambdaListFreePostsResource.addMethod('GET', lambdaIntegrationListFreePosts);

    //Вывод одного элемента
    const GetFreePostLambda = new NodejsFunction(that, 'GetFreePostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'FreePosts', 'GetFreePostLambda.ts'),
        handler: 'GetFreePostHandler',
        functionName: 'react-FreePosts-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationGetFreePosts = new apigateway.LambdaIntegration(GetFreePostLambda);
    lambdaGetFreePostsResource.addMethod('GET', lambdaIntegrationGetFreePosts);

    //Добавлении типа подписки
    const AddFreePostLambda = new NodejsFunction(that, 'AddFreePostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'FreePosts', 'AddFreePostLambda.ts'),
        handler: 'AddFreePostHandler',
        functionName: 'react-FreePosts-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationAddFreePost = new apigateway.LambdaIntegration(AddFreePostLambda);
    lambdaAddSubscriptionResource.addMethod('POST', lambdaIntegrationAddFreePost);

    //редактирование опции оплаты
    const EditFreePostLambda = new NodejsFunction(that, 'EditFreePostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'FreePosts', 'EditFreePostLambda.ts'),
        handler: 'EditFreePostHandler',
        functionName: 'react-FreePosts-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationEditFreePost = new apigateway.LambdaIntegration(EditFreePostLambda);
    lambdaEdutFreePostsResource.addMethod('PUT', lambdaIntegrationEditFreePost);

    //удаление опции оплаты
    const DeleteFreePostLambda = new NodejsFunction(that, 'DeleteFreePostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'FreePosts', 'DeleteFreePostLambda.ts'),
        handler: 'DeleteFreePostHandler',
        functionName: 'react-FreePosts-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,

        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationDeleteFreePost = new apigateway.LambdaIntegration(DeleteFreePostLambda);
    lambdaDeleteFreePostsResource.addMethod('DELETE', lambdaIntegrationDeleteFreePost);

    GrantAccessToDDB([ListFreePostsLambda, AddFreePostLambda, EditFreePostLambda, DeleteFreePostLambda, GetFreePostLambda], tables);
}
