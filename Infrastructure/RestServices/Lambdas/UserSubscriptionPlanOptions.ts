import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';

export function CreateUserSubscriptionPlanOptionsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListUserSubscriptionPlanOptionsResource = rootResource.addResource('List');
    const lambdaListUserSubscriptionPlanOptionsWithContentPlansResource = rootResource.addResource('ListWithContentPlans');
    const lambdaGetUserSubscriptionPlanOptionsResource = rootResource.addResource('Get');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaDeleteUserSubscriptionPlanOptionsResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListUserSubscriptionPlanOptionsLambda = new NodejsFunction(that, 'ListUserSubscriptionPlanOptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'ListUserSubscriptionPlanOptionsLambda.ts'),
        handler: 'ListUserSubscriptionPlanOptionsHandler',
        functionName: 'react-UserSubscriptionPlanOptions-List-Lambda',
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
    const lambdaIntegrationListUserSubscriptionPlanOptions = new apigateway.LambdaIntegration(ListUserSubscriptionPlanOptionsLambda);
    lambdaListUserSubscriptionPlanOptionsResource.addMethod('GET', lambdaIntegrationListUserSubscriptionPlanOptions);

    //Вывод списка2
    const ListUserSubscriptionPlanOptionsListWithContentPlansLambda = new NodejsFunction(that, 'ListUserSubscriptionPlanOptionsListWithContentPlansLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'ListUserSubscriptionPlanOptionsWithContentLambda.ts'),
        handler: 'ListUserSubscriptionPlanOptionsWithContentHandler',
        functionName: 'react-UserSubscriptionPlanOptions-ListWithContentPlans-Lambda',
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
    const lambdaIntegrationListUserSubscriptionPlanOptionsWithContentPlans = new apigateway.LambdaIntegration(ListUserSubscriptionPlanOptionsListWithContentPlansLambda);
    lambdaListUserSubscriptionPlanOptionsWithContentPlansResource.addMethod('GET', lambdaIntegrationListUserSubscriptionPlanOptionsWithContentPlans);

    //Вывод одного элемента
    const GetSubscriptionPlanLambda = new NodejsFunction(that, 'GetUserSubscriptionPlanOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'GetUserSubscriptionPlanOptionLambda.ts'),
        handler: 'GetUserSubscriptionPlanOptionHandler',
        functionName: 'react-UserSubscriptionPlanOptions-Get-Lambda',
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
    const lambdaIntegrationGetUserSubscriptionPlanOptions = new apigateway.LambdaIntegration(GetSubscriptionPlanLambda);
    lambdaGetUserSubscriptionPlanOptionsResource.addMethod('GET', lambdaIntegrationGetUserSubscriptionPlanOptions);

    //Добавлении типа подписки
    const AddSubscriptionPlanLambda = new NodejsFunction(that, 'AddUserSubscriptionPlanOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'AddUserSubscriptionPlanOptionLambda.ts'),
        handler: 'AddUserSubscriptionPlanOptionHandler',
        functionName: 'react-UserSubscriptionPlanOptions-Add-Lambda',
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
    const lambdaIntegrationAddSubscriptionPlan = new apigateway.LambdaIntegration(AddSubscriptionPlanLambda);
    lambdaAddSubscriptionResource.addMethod('POST', lambdaIntegrationAddSubscriptionPlan);

    //удаление опции оплаты
    const DeleteSubscriptionPlanLambda = new NodejsFunction(that, 'DeleteUserSubscriptionPlaOptionnLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'DeleteUserSubscriptionPlanOptionLambda.ts'),
        handler: 'DeleteUserSubscriptionPlanOptionHandler',
        functionName: 'react-UserSubscriptionPlanOptions-Delete-Lambda',
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
    const lambdaIntegrationDeleteSubscriptionPlan = new apigateway.LambdaIntegration(DeleteSubscriptionPlanLambda);
    lambdaDeleteUserSubscriptionPlanOptionsResource.addMethod('DELETE', lambdaIntegrationDeleteSubscriptionPlan);

    GrantAccessToDDB(
        [ListUserSubscriptionPlanOptionsLambda, AddSubscriptionPlanLambda, DeleteSubscriptionPlanLambda, GetSubscriptionPlanLambda, ListUserSubscriptionPlanOptionsListWithContentPlansLambda],
        tables
    );
}
