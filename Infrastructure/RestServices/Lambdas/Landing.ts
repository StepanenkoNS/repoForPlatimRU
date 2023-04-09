import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/LambdaHelpers/AccessHelper';

export function CreateBotSetLandingLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const UpdateBotLandingPage = new NodejsFunction(that, 'SetBotLandingPageLamda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebBotLandingPages', 'UpdateBotLanding.ts'),
        handler: 'UpdateBotLandingHandler',
        functionName: 'react-BotLanding-Update-Lambda',
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
    const lambdaIntegrationUpdateBotLanding = new apigateway.LambdaIntegration(UpdateBotLandingPage);
    rootResource.addMethod('PUT', lambdaIntegrationUpdateBotLanding);

    //предоставление доступа

    GrantAccessToDDB([UpdateBotLandingPage], tables);
}
