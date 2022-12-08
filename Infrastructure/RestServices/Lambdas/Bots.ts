import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '../Helper';

export function CreateBotsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaGetMyBotsResource = rootResource.addResource('GetMyBots');

    const ListBotsLambda = new NodejsFunction(that, 'ListBotsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'ListMyBots.ts'),
        handler: 'ListMyBotsHandler',
        functionName: 'react-ListBots-Lambda',
        runtime: Runtime.NODEJS_16_X,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
            botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const lambdaIntegrationListBots = new apigateway.LambdaIntegration(ListBotsLambda);
    lambdaGetMyBotsResource.addMethod('GET', lambdaIntegrationListBots);

    //Добавление политик
    GrantAccessToSecrets([ListBotsLambda]);

    GrantAccessToDDB([ListBotsLambda], tables);
}
