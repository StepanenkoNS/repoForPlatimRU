import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, GrantAccessToSecrets } from '../Helper';

export function CreateSubscriptionDurationLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListSubscriptionDurationResource = rootResource.addResource('List');
    const lambdaAddSubscriptionDurationResource = rootResource.addResource('Add');
    const lambdaDeleteSubscriptionDurationResource = rootResource.addResource('Delete');
    const lambdaEditSubscriptionDurationResource = rootResource.addResource('Edit');
    //Вывод списка
    const ListSubscriptionDurationLambda = new NodejsFunction(that, 'ListSubscriptionDurationLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionDuration', 'ListSubscriptionDurationLambda.ts'),
        handler: 'ListSubscriptionDurationHandler',
        functionName: 'react-ListSubscriptionDuration-Lambda',
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
    const lambdaIntegrationListSubscriptionDuration = new apigateway.LambdaIntegration(ListSubscriptionDurationLambda);
    lambdaListSubscriptionDurationResource.addMethod('GET', lambdaIntegrationListSubscriptionDuration);

    //Добавлении типа подписки
    const AddSubscriptionLambda = new NodejsFunction(that, 'AddSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionDuration', 'AddSubscriptionLambda.ts'),
        handler: 'AddSubscriptionHandler',
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
    const lambdaIntegrationAddSubscription = new apigateway.LambdaIntegration(AddSubscriptionLambda);
    lambdaAddSubscriptionDurationResource.addMethod('POST', lambdaIntegrationAddSubscription);

    //редактирование опции оплаты
    const EditSubscriptionLambda = new NodejsFunction(that, 'EditSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionDuration', 'EditSubscriptionLambda.ts'),
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
    const lambdaIntegrationEditSubscription = new apigateway.LambdaIntegration(EditSubscriptionLambda);
    lambdaEditSubscriptionDurationResource.addMethod('PUT', lambdaIntegrationEditSubscription);

    //удаление опции оплаты
    const DeleteSubscriptionLambda = new NodejsFunction(that, 'DeleteSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SubscriptionDuration', 'DeleteSubscriptionLambda.ts'),
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
    const lambdaIntegrationDeleteSubscription = new apigateway.LambdaIntegration(DeleteSubscriptionLambda);
    lambdaDeleteSubscriptionDurationResource.addMethod('DELETE', lambdaIntegrationDeleteSubscription);

    //Добавление политик
    GrantAccessToSecrets([ListSubscriptionDurationLambda, AddSubscriptionLambda, EditSubscriptionLambda, DeleteSubscriptionLambda]);

    GrantAccessToDDB([ListSubscriptionDurationLambda, AddSubscriptionLambda, EditSubscriptionLambda, DeleteSubscriptionLambda], tables);
}
