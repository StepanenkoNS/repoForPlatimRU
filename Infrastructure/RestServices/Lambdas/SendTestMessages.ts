import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToS3 } from '/opt/LambdaHelpers/AccessHelper';

export function CreateSendMessagesLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const lambdaSendTestMessageResource = rootResource.addResource('SendTestMessage');
    const lambdaSendTestFileResource = rootResource.addResource('SendTestFile');

    //Отправка сообщения себе
    const SendTestMessageLambda = new NodejsFunction(that, 'SendTestMessageLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessage', 'SendTestMessageLambda.ts'),
        handler: 'SendTestMessageHandler',
        functionName: 'react-SendMessages-SendTestMessage-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
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
    const lambdaIntegrationSendTestMessage = new apigateway.LambdaIntegration(SendTestMessageLambda);
    lambdaSendTestMessageResource.addMethod('POST', lambdaIntegrationSendTestMessage);

    //Отправка файла себе
    const SendTestFileLambda = new NodejsFunction(that, 'SendTestFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessage', 'SendTestFileLambda.ts'),
        handler: 'SendTestFileHandler',
        functionName: 'react-SendMessages-SendTestFile-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
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
    const lambdaIntegrationSendTestFile = new apigateway.LambdaIntegration(SendTestFileLambda);
    lambdaSendTestFileResource.addMethod('POST', lambdaIntegrationSendTestFile);

    GrantAccessToDDB([SendTestMessageLambda, SendTestFileLambda], tables);
    GrantAccessToS3([SendTestMessageLambda, SendTestFileLambda], [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]);
}
