import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';

export function CreateUserSubscriptionPlansLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListUserSubscriptionPlansResource = rootResource.addResource('List');
    const lambdaGetUserSubscriptionPlansResource = rootResource.addResource('Get');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaEdutUserSubscriptionPlansResource = rootResource.addResource('Edit');
    const lambdaDeleteUserSubscriptionPlansResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListUserSubscriptionPlansLambda = new NodejsFunction(that, 'ListUserSubscriptionPlansLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlans', 'ListUserSubscriptionPlansLambda.ts'),
        handler: 'ListUserSubscriptionPlansHandler',
        functionName: 'react-UserSubscriptionPlans-List-Lambda',
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
    const lambdaIntegrationListUserSubscriptionPlans = new apigateway.LambdaIntegration(ListUserSubscriptionPlansLambda);
    lambdaListUserSubscriptionPlansResource.addMethod('GET', lambdaIntegrationListUserSubscriptionPlans);

    //Вывод одного элемента
    const GetSubscriptionPlanLambda = new NodejsFunction(that, 'GetUserSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlans', 'GetUserSubscriptionPlanLambda.ts'),
        handler: 'GetUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlans-Get-Lambda',
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
    const lambdaIntegrationGetUserSubscriptionPlans = new apigateway.LambdaIntegration(GetSubscriptionPlanLambda);
    lambdaGetUserSubscriptionPlansResource.addMethod('GET', lambdaIntegrationGetUserSubscriptionPlans);

    //Добавлении типа подписки
    const AddSubscriptionPlanLambda = new NodejsFunction(that, 'AddUserSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlans', 'AddUserSubscriptionPlanLambda.ts'),
        handler: 'AddUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlans-Add-Lambda',
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

    //редактирование опции оплаты
    const EditSubscriptionPlanLambda = new NodejsFunction(that, 'EditUserSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlans', 'EditUserSubscriptionPlanLambda.ts'),
        handler: 'EditUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlans-Edit-Lambda',
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
    const lambdaIntegrationEditSubscriptionPlan = new apigateway.LambdaIntegration(EditSubscriptionPlanLambda);
    lambdaEdutUserSubscriptionPlansResource.addMethod('PUT', lambdaIntegrationEditSubscriptionPlan);

    //удаление опции оплаты
    const DeleteSubscriptionPlanLambda = new NodejsFunction(that, 'DeleteUserSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlans', 'DeleteUserSubscriptionPlanLambda.ts'),
        handler: 'DeleteUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlans-Delete-Lambda',
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
    lambdaDeleteUserSubscriptionPlansResource.addMethod('DELETE', lambdaIntegrationDeleteSubscriptionPlan);

    GrantAccessToDDB([ListUserSubscriptionPlansLambda, AddSubscriptionPlanLambda, EditSubscriptionPlanLambda, DeleteSubscriptionPlanLambda, GetSubscriptionPlanLambda], tables);
}
