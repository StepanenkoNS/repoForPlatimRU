import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToRoute53, GrantAccessToSecrets } from '/opt/LambdaHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateBotsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const ListBotsLambda = new NodejsFunction(that, 'ListBotsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'ListBotsLambda.ts'),
        handler: 'ListBotsHandler',
        functionName: 'react-Bots-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
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
    const GetBotLambda = new NodejsFunction(that, 'GetBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'GetBotLambda.ts'),
        handler: 'GetBotHandler',
        functionName: 'react-Bots-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
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

    //Добавление
    const AddBotLambda = new NodejsFunction(that, 'AddBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'AddBotLambda.ts'),
        handler: 'AddBotHandler',
        functionName: 'react-Bots-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            telegramFacingAPIurl: DynamicEnvironment.GateWays.messageBotTelegramFacingGW,
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

    //регистрация
    const RegisterBotLambda = new NodejsFunction(that, 'RegisterBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'RegisterBotLambda.ts'),
        handler: 'RegisterBotHandler',
        functionName: 'react-Bots-Register-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            telegramFacingAPIurl: DynamicEnvironment.GateWays.messageBotTelegramFacingGW,
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

    //отмена регистрации
    const UnRegisterBotLambda = new NodejsFunction(that, 'UnRegisterBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'UnRegisterBotLambda.ts'),
        handler: 'UnRegisterBotHandler',
        functionName: 'react-Bots-UnRegister-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            telegramFacingAPIurl: DynamicEnvironment.GateWays.messageBotTelegramFacingGW,
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

    //редактирование
    const EditBotLambda = new NodejsFunction(that, 'EditBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'EditBotLambda.ts'),
        handler: 'EditBotHandler',
        functionName: 'react-Bots-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            telegramFacingAPIurl: DynamicEnvironment.GateWays.messageBotTelegramFacingGW,
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

    //удаление
    const DeleteBotLambda = new NodejsFunction(that, 'DeleteBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'DeleteBotLambda.ts'),
        handler: 'DeleteBotHandler',
        functionName: 'react-Bots-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
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

    //Добавление политик
    GrantAccessToSecrets([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda]);
    GrantAccessToRoute53([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda]);

    GrantAccessToDDB([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListBotsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddBotLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });
    returnArray.push({
        lambda: GetBotLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: EditBotLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });
    returnArray.push({
        lambda: RegisterBotLambda,
        resource: 'Register',
        httpMethod: 'PUT'
    });
    returnArray.push({
        lambda: UnRegisterBotLambda,
        resource: 'UnRegister',
        httpMethod: 'PUT'
    });
    returnArray.push({
        lambda: DeleteBotLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
