import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '../Helper';

export function CreateSubscriptionOptionsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListSubscriptionOptionsResource = rootResource.addResource('List');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaDeleteSubscriptionOptionsResource = rootResource.addResource('Delete');
    const lambdaEdutSubscriptionOptionsResource = rootResource.addResource('Edit');
    //Вывод списка
    const ListSubscriptionOptionsLambda = new NodejsFunction(that, 'ListSubscriptionOptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionOptions', 'ListSubscriptionOptionsLambda.ts'),
        handler: 'ListSubscriptionOptionsHandler',
        functionName: 'react-ListSubscriptionOptions-Lambda',
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
    const lambdaIntegrationListSubscriptionOptions = new apigateway.LambdaIntegration(ListSubscriptionOptionsLambda);
    lambdaListSubscriptionOptionsResource.addMethod('GET', lambdaIntegrationListSubscriptionOptions);

    //Добавлении типа подписки
    const AddSubscriptionOptionLambda = new NodejsFunction(that, 'AddSubscriptionOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionOptions', 'AddSubscriptionOptionLambda.ts'),
        handler: 'AddSubscriptionOptionHandler',
        functionName: 'react-AddSubscription-Lambda',
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
    const lambdaIntegrationAddSubscriptionOption = new apigateway.LambdaIntegration(AddSubscriptionOptionLambda);
    lambdaAddSubscriptionResource.addMethod('POST', lambdaIntegrationAddSubscriptionOption);

    //редактирование опции оплаты
    const EditSubscriptionOptionLambda = new NodejsFunction(that, 'EditSubscriptionOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionOptions', 'EditSubscriptionOptionLambda.ts'),
        handler: 'EditSubscriptionHandler',
        functionName: 'react-EditSubscription-Lambda',
        runtime: Runtime.NODEJS_16_X,
        timeout: Duration.seconds(15),
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
    const lambdaIntegrationEditSubscriptionOption = new apigateway.LambdaIntegration(EditSubscriptionOptionLambda);
    lambdaEdutSubscriptionOptionsResource.addMethod('PUT', lambdaIntegrationEditSubscriptionOption);

    //удаление опции оплаты
    const DeleteSubscriptionOptionLambda = new NodejsFunction(that, 'DeleteSubscriptionOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionOptions', 'DeleteSubscriptionOptionLambda.ts'),
        handler: 'DeleteSubscriptionHandler',
        functionName: 'react-DeleteSubscription-Lambda',
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
    const lambdaIntegrationDeleteSubscriptionOption = new apigateway.LambdaIntegration(DeleteSubscriptionOptionLambda);
    lambdaDeleteSubscriptionOptionsResource.addMethod('DELETE', lambdaIntegrationDeleteSubscriptionOption);

    //Добавление политик
    GrantAccessToSecrets([ListSubscriptionOptionsLambda, AddSubscriptionOptionLambda, EditSubscriptionOptionLambda, DeleteSubscriptionOptionLambda]);

    GrantAccessToDDB([ListSubscriptionOptionsLambda, AddSubscriptionOptionLambda, EditSubscriptionOptionLambda, DeleteSubscriptionOptionLambda], tables);
}
