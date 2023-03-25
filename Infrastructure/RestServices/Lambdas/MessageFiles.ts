import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';

//@ts-ignore
import { GrantAccessToDDB, GrantAccessToS3 } from '/opt/LambdaHelpers/AccessHelper';

export function CreateMessageFilesLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListMessageFilesResource = rootResource.addResource('List');
    const lambdaGetMessageFilesResource = rootResource.addResource('Get');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaEdutMessageFilesResource = rootResource.addResource('Edit');
    const lambdaDeleteMessageFilesResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListMessageFilesLambda = new NodejsFunction(that, 'ListMessageFilesLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MessageFiles', 'ListMessageFilesLambda.ts'),
        handler: 'ListMessageFilesHandler',
        functionName: 'react-MessageFiles-List-Lambda',
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
    const lambdaIntegrationListMessageFiles = new apigateway.LambdaIntegration(ListMessageFilesLambda);
    lambdaListMessageFilesResource.addMethod('GET', lambdaIntegrationListMessageFiles);

    //Вывод одного элемента
    const GetMessageFileLambda = new NodejsFunction(that, 'GetMessageFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MessageFiles', 'GetMessageFileLambda.ts'),
        handler: 'GetMessageFileHandler',
        functionName: 'react-MessageFiles-Get-Lambda',
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
    const lambdaIntegrationGetMessageFiles = new apigateway.LambdaIntegration(GetMessageFileLambda);
    lambdaGetMessageFilesResource.addMethod('GET', lambdaIntegrationGetMessageFiles);

    //Добавлении типа подписки
    const AddMessageFileLambda = new NodejsFunction(that, 'AddMessageFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MessageFiles', 'AddMessageFileLambda.ts'),
        handler: 'AddMessageFileHandler',
        functionName: 'react-MessageFiles-Add-Lambda',
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
    const lambdaIntegrationAddMessageFile = new apigateway.LambdaIntegration(AddMessageFileLambda);
    lambdaAddSubscriptionResource.addMethod('POST', lambdaIntegrationAddMessageFile);

    //редактирование опции оплаты
    const EditMessageFileLambda = new NodejsFunction(that, 'EditMessageFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MessageFiles', 'EditMessageFileLambda.ts'),
        handler: 'EditMessageFileHandler',
        functionName: 'react-MessageFiles-Edit-Lambda',
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
    const lambdaIntegrationEditMessageFile = new apigateway.LambdaIntegration(EditMessageFileLambda);
    lambdaEdutMessageFilesResource.addMethod('PUT', lambdaIntegrationEditMessageFile);

    //удаление опции оплаты
    const DeleteMessageFileLambda = new NodejsFunction(that, 'DeleteMessageFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'MessageFiles', 'DeleteMessageFileLambda.ts'),
        handler: 'DeleteMessageFileHandler',
        functionName: 'react-MessageFiles-Delete-Lambda',
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
    const lambdaIntegrationDeleteMessageFile = new apigateway.LambdaIntegration(DeleteMessageFileLambda);
    lambdaDeleteMessageFilesResource.addMethod('DELETE', lambdaIntegrationDeleteMessageFile);

    GrantAccessToDDB([ListMessageFilesLambda, AddMessageFileLambda, EditMessageFileLambda, DeleteMessageFileLambda, GetMessageFileLambda], tables);

    GrantAccessToS3(
        [ListMessageFilesLambda, AddMessageFileLambda, EditMessageFileLambda, DeleteMessageFileLambda, GetMessageFileLambda],
        [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]
    );
}
