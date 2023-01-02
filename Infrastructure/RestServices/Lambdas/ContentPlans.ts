import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '../Helper';

export function CreateContentPlansLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListContentPlansResource = rootResource.addResource('List');
    const lambdaGetContentPlansResource = rootResource.addResource('Get');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaEdutContentPlansResource = rootResource.addResource('Edit');
    const lambdaDeleteContentPlansResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListContentPlansLambda = new NodejsFunction(that, 'ListContentPlansLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'ListContentPlansLambda.ts'),
        handler: 'ListContentPlansHandler',
        functionName: 'react-ContentPlans-List-Lambda',
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
    const lambdaIntegrationListContentPlans = new apigateway.LambdaIntegration(ListContentPlansLambda);
    lambdaListContentPlansResource.addMethod('GET', lambdaIntegrationListContentPlans);

    //Вывод одного элемента
    const GetContentPlanLambda = new NodejsFunction(that, 'GetContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'GetContentPlanLambda.ts'),
        handler: 'GetContentPlanHandler',
        functionName: 'react-ContentPlans-Get-Lambda',
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
    const lambdaIntegrationGetContentPlans = new apigateway.LambdaIntegration(GetContentPlanLambda);
    lambdaGetContentPlansResource.addMethod('GET', lambdaIntegrationGetContentPlans);

    //Добавлении типа подписки
    const AddContentPlanLambda = new NodejsFunction(that, 'AddContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'AddContentPlanLambda.ts'),
        handler: 'AddContentPlanHandler',
        functionName: 'react-ContentPlans-Add-Lambda',
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
    const lambdaIntegrationAddContentPlan = new apigateway.LambdaIntegration(AddContentPlanLambda);
    lambdaAddSubscriptionResource.addMethod('POST', lambdaIntegrationAddContentPlan);

    //редактирование опции оплаты
    const EditContentPlanLambda = new NodejsFunction(that, 'EditContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'EditContentPlanLambda.ts'),
        handler: 'EditContentPlanHandler',
        functionName: 'react-ContentPlans-Edit-Lambda',
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
    const lambdaIntegrationEditContentPlan = new apigateway.LambdaIntegration(EditContentPlanLambda);
    lambdaEdutContentPlansResource.addMethod('PUT', lambdaIntegrationEditContentPlan);

    //удаление опции оплаты
    const DeleteContentPlanLambda = new NodejsFunction(that, 'DeleteContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'DeleteContentPlanLambda.ts'),
        handler: 'DeleteContentPlanHandler',
        functionName: 'react-ContentPlans-Delete-Lambda',
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
    const lambdaIntegrationDeleteContentPlan = new apigateway.LambdaIntegration(DeleteContentPlanLambda);
    lambdaDeleteContentPlansResource.addMethod('DELETE', lambdaIntegrationDeleteContentPlan);

    GrantAccessToDDB([ListContentPlansLambda, AddContentPlanLambda, EditContentPlanLambda, DeleteContentPlanLambda, GetContentPlanLambda], tables);
}
