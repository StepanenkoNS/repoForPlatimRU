import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '../Helper';

export function CreateSubscriptionSettingsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    // const lambdaGetSubscriptionSettingsResource = rootResource.addResource('Get');
    // const lambdaEdutSubscriptionSettingsResource = rootResource.addResource('Set');
    //Получение моей подписки
    const GetSubscriptionSettingsLambda = new NodejsFunction(that, 'GetSubscriptionSettingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionSettings', 'GetSubscriptionSettingsLambda.ts'),
        handler: 'GetSubscriptionSettingsHandler',
        functionName: 'react-SubscriptionSettings-Get-Lambda',
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
    const lambdaIntegrationGetSubscriptionSettings = new apigateway.LambdaIntegration(GetSubscriptionSettingsLambda);
    rootResource.addMethod('GET', lambdaIntegrationGetSubscriptionSettings);

    GrantAccessToDDB([GetSubscriptionSettingsLambda], tables);
}
