import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '/opt/LambdaHelpers/AccessHelper';

export function CreateCurrencySettingsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    // const lambdaGetCurrencySettingsResource = rootResource.addResource('Get');
    // const lambdaEdutCurrencySettingsResource = rootResource.addResource('Set');
    //Получение валюты по-умолчанию
    const GetCurrencySettingsLambda = new NodejsFunction(that, 'GetCurrencySettingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CurrencySettings', 'GetCurrencySettingsLambda.ts'),
        handler: 'GetCurrencySettingsHandler',
        functionName: 'react-CurrencySettings-Get-Lambda',
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
    const lambdaIntegrationGetCurrencySettings = new apigateway.LambdaIntegration(GetCurrencySettingsLambda);
    rootResource.addMethod('GET', lambdaIntegrationGetCurrencySettings);

    //редактирование валюты по-умолчанию
    const EditCurrencySettingsLambda = new NodejsFunction(that, 'EditCurrencySettingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CurrencySettings', 'EditCurrencySettingsLambda.ts'),
        handler: 'EditCurrencySettingsHandler',
        functionName: 'react-CurrencySettings-Update-Lambda',
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
    const lambdaIntegrationEditCurrencySettings = new apigateway.LambdaIntegration(EditCurrencySettingsLambda);
    rootResource.addMethod('PUT', lambdaIntegrationEditCurrencySettings);

    //Добавление политик
    GrantAccessToSecrets([GetCurrencySettingsLambda, EditCurrencySettingsLambda]);

    GrantAccessToDDB([GetCurrencySettingsLambda, EditCurrencySettingsLambda], tables);
}
