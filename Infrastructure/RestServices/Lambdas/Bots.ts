import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '/opt/LambdaHelpers/AccessHelper';

export function CreateBotsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListBotsResource = rootResource.addResource('List');
    const lambdaGetBotsResource = rootResource.addResource('Get');
    const lambdaAddBotResource = rootResource.addResource('Add');
    const lambdaEditBotsResource = rootResource.addResource('Edit');
    const lambdaRegisterBotsResource = rootResource.addResource('Register');
    const lambdaUnRegisterBotsResource = rootResource.addResource('UnRegister');

    const lambdaDeleteBotsResource = rootResource.addResource('Delete');

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

    const lambdaIntegrationListBots = new apigateway.LambdaIntegration(ListBotsLambda);
    lambdaListBotsResource.addMethod('GET', lambdaIntegrationListBots);

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
    const lambdaIntegrationGetBots = new apigateway.LambdaIntegration(GetBotLambda);
    lambdaGetBotsResource.addMethod('GET', lambdaIntegrationGetBots);

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
    const lambdaIntegrationAddBot = new apigateway.LambdaIntegration(AddBotLambda);
    lambdaAddBotResource.addMethod('POST', lambdaIntegrationAddBot);

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
    const lambdaIntegrationRegisterBot = new apigateway.LambdaIntegration(RegisterBotLambda);
    lambdaRegisterBotsResource.addMethod('PUT', lambdaIntegrationRegisterBot);

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
    const lambdaIntegrationUnRegisterBot = new apigateway.LambdaIntegration(UnRegisterBotLambda);
    lambdaUnRegisterBotsResource.addMethod('PUT', lambdaIntegrationUnRegisterBot);
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
    const lambdaIntegrationEditBot = new apigateway.LambdaIntegration(EditBotLambda);
    lambdaEditBotsResource.addMethod('PUT', lambdaIntegrationEditBot);

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
    const lambdaIntegrationDeleteBot = new apigateway.LambdaIntegration(DeleteBotLambda);
    lambdaDeleteBotsResource.addMethod('DELETE', lambdaIntegrationDeleteBot);

    //Добавление политик
    GrantAccessToSecrets([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda]);

    GrantAccessToDDB([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda], tables);
}
