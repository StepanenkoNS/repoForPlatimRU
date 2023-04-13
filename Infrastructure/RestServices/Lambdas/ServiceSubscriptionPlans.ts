import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateServiceSubscriptionPlansLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //Вывод списка
    const ListServiceSubscriptionPlansLambda = new NodejsFunction(that, 'ListServiceSubscriptionPlansLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ServiceSubscriptionPlans', 'ListServiceSubscriptionPlansLambda.ts'),
        handler: 'ListServiceSubscriptionPlansHandler',
        functionName: 'react-ServiceSubscriptionPlans-List-Lambda',
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
    const GetServiceSubscriptionPlanLambda = new NodejsFunction(that, 'GetServiceSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ServiceSubscriptionPlans', 'GetServiceSubscriptionPlanLambda.ts'),
        handler: 'GetServiceSubscriptionPlanHandler',
        functionName: 'react-ServiceSubscriptionPlans-Get-Lambda',
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
    const AddServiceSubscriptionPlanLambda = new NodejsFunction(that, 'AddServiceSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ServiceSubscriptionPlans', 'AddServiceSubscriptionPlanLambda.ts'),
        handler: 'AddServiceSubscriptionPlanHandler',
        functionName: 'react-ServiceSubscriptionPlans-Add-Lambda',
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
    const EditServiceSubscriptionPlanLambda = new NodejsFunction(that, 'EditServiceSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ServiceSubscriptionPlans', 'EditServiceSubscriptionPlanLambda.ts'),
        handler: 'EditServiceSubscriptionPlanHandler',
        functionName: 'react-ServiceSubscriptionPlans-Edit-Lambda',
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
    const DeleteServiceSubscriptionPlanLambda = new NodejsFunction(that, 'DeleteServiceSubscriptionPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ServiceSubscriptionPlans', 'DeleteServiceSubscriptionPlanLambda.ts'),
        handler: 'DeleteServiceSubscriptionPlanHandler',
        functionName: 'react-ServiceSubscriptionPlans-Delete-Lambda',
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

    GrantAccessToDDB(
        [ListServiceSubscriptionPlansLambda, AddServiceSubscriptionPlanLambda, EditServiceSubscriptionPlanLambda, DeleteServiceSubscriptionPlanLambda, GetServiceSubscriptionPlanLambda],
        tables
    );

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListServiceSubscriptionPlansLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetServiceSubscriptionPlanLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddServiceSubscriptionPlanLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditServiceSubscriptionPlanLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteServiceSubscriptionPlanLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
