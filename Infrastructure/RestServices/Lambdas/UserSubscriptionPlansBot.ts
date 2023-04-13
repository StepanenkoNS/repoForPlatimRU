import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateUserSubscriptionPlansBotsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListUserSubscriptionPlansBotsLambda = new NodejsFunction(that, 'ListUserSubscriptionPlansBotsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'ListUserSubscriptionPlansLambda.ts'),
        handler: 'ListUserSubscriptionPlansHandler',
        functionName: 'react-UserSubscriptionPlansBot-List-Lambda',
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

    //Вывод одного элемента
    const GetSubscriptionPlanBotLambda = new NodejsFunction(that, 'GetSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'GetUserSubscriptionPlanLambda.ts'),
        handler: 'GetUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlansBot-Get-Lambda',
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

    //Добавлении типа подписки
    const AddSubscriptionPlanBotLambda = new NodejsFunction(that, 'AddSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'AddUserSubscriptionPlanLambda.ts'),
        handler: 'AddUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlansBot-Add-Lambda',
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

    //редактирование опции оплаты
    const EditSubscriptionPlanBotLambda = new NodejsFunction(that, 'EditSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'EditUserSubscriptionPlanLambda.ts'),
        handler: 'EditUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlansBot-Edit-Lambda',
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

    //удаление опции оплаты
    const DeleteSubscriptionPlanBotLambda = new NodejsFunction(that, 'DeleteSubscriptionPlanBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansBot', 'DeleteUserSubscriptionPlanLambda.ts'),
        handler: 'DeleteUserSubscriptionPlanHandler',
        functionName: 'react-UserSubscriptionPlansBot-Delete-Lambda',
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

    GrantAccessToDDB([ListUserSubscriptionPlansBotsLambda, AddSubscriptionPlanBotLambda, EditSubscriptionPlanBotLambda, DeleteSubscriptionPlanBotLambda, GetSubscriptionPlanBotLambda], tables);

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
