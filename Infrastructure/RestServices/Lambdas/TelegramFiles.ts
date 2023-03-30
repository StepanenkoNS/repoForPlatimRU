import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';

//@ts-ignore
import { GrantAccessToDDB, GrantAccessToS3 } from '/opt/LambdaHelpers/AccessHelper';

export function CreateTelegramFilesLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListTelegramFilesResource = rootResource.addResource('List');
    const lambdaGetTelegramFilesResource = rootResource.addResource('Get');

    const lambdaEdutTelegramFilesResource = rootResource.addResource('Edit');
    const lambdaDeleteTelegramFilesResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListTelegramFilesLambda = new NodejsFunction(that, 'ListTelegramFilesLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'ListTelegramFilesLambda.ts'),
        handler: 'ListTelegramFilesHandler',
        functionName: 'react-TelegramFiles-List-Lambda',
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
    const lambdaIntegrationListTelegramFiles = new apigateway.LambdaIntegration(ListTelegramFilesLambda);
    lambdaListTelegramFilesResource.addMethod('GET', lambdaIntegrationListTelegramFiles);

    //Вывод одного элемента
    const GetTelegramFileLambda = new NodejsFunction(that, 'GetTelegramFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'GetTelegramFileLambda.ts'),
        handler: 'GetTelegramFileHandler',
        functionName: 'react-TelegramFiles-Get-Lambda',
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
    const lambdaIntegrationGetTelegramFiles = new apigateway.LambdaIntegration(GetTelegramFileLambda);
    lambdaGetTelegramFilesResource.addMethod('GET', lambdaIntegrationGetTelegramFiles);

    //редактирование опции оплаты
    const EditTelegramFileLambda = new NodejsFunction(that, 'EditTelegramFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'EditTelegramFileLambda.ts'),
        handler: 'EditTelegramFileHandler',
        functionName: 'react-TelegramFiles-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
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
    const lambdaIntegrationEditTelegramFile = new apigateway.LambdaIntegration(EditTelegramFileLambda);
    lambdaEdutTelegramFilesResource.addMethod('PUT', lambdaIntegrationEditTelegramFile);

    //удаление опции оплаты
    const DeleteTelegramFileLambda = new NodejsFunction(that, 'DeleteTelegramFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'DeleteTelegramFileLambda.ts'),
        handler: 'DeleteTelegramFileHandler',
        functionName: 'react-TelegramFiles-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
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
    const lambdaIntegrationDeleteTelegramFile = new apigateway.LambdaIntegration(DeleteTelegramFileLambda);
    lambdaDeleteTelegramFilesResource.addMethod('DELETE', lambdaIntegrationDeleteTelegramFile);

    GrantAccessToDDB([ListTelegramFilesLambda, EditTelegramFileLambda, DeleteTelegramFileLambda, GetTelegramFileLambda], tables);

    GrantAccessToS3(
        [ListTelegramFilesLambda, EditTelegramFileLambda, DeleteTelegramFileLambda, GetTelegramFileLambda],
        [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]
    );
}
