import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '../Helper';

export function CreateContentPlanPostsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const lambdaListContentPlanPostsResource = rootResource.addResource('List');
    const lambdaGetContentPlanPostsResource = rootResource.addResource('Get');
    const lambdaAddSubscriptionResource = rootResource.addResource('Add');
    const lambdaEdutContentPlanPostsResource = rootResource.addResource('Edit');
    const lambdaDeleteContentPlanPostsResource = rootResource.addResource('Delete');

    //Вывод списка
    const ListContentPlanPostsLambda = new NodejsFunction(that, 'ListContentPlanPostsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'ListContentPlanPostsLambda.ts'),
        handler: 'ListContentPlanPostsHandler',
        functionName: 'react-ContentPlanPosts-List-Lambda',
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
    const lambdaIntegrationListContentPlanPosts = new apigateway.LambdaIntegration(ListContentPlanPostsLambda);
    lambdaListContentPlanPostsResource.addMethod('GET', lambdaIntegrationListContentPlanPosts);

    //Вывод одного элемента
    const GetContentPlanPostLambda = new NodejsFunction(that, 'GetContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'GetContentPlanPostLambda.ts'),
        handler: 'GetContentPlanPostHandler',
        functionName: 'react-ContentPlanPosts-Get-Lambda',
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
    const lambdaIntegrationGetContentPlanPosts = new apigateway.LambdaIntegration(GetContentPlanPostLambda);
    lambdaGetContentPlanPostsResource.addMethod('POST', lambdaIntegrationGetContentPlanPosts);

    //Добавлении типа подписки
    const AddContentPlanPostLambda = new NodejsFunction(that, 'AddContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'AddContentPlanPostLambda.ts'),
        handler: 'AddContentPlanPostHandler',
        functionName: 'react-ContentPlanPosts-Add-Lambda',
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
    const lambdaIntegrationAddContentPlanPost = new apigateway.LambdaIntegration(AddContentPlanPostLambda);
    lambdaAddSubscriptionResource.addMethod('POST', lambdaIntegrationAddContentPlanPost);

    //редактирование опции оплаты
    const EditContentPlanPostLambda = new NodejsFunction(that, 'EditContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'EditContentPlanPostLambda.ts'),
        handler: 'EditContentPlanPostHandler',
        functionName: 'react-ContentPlanPosts-Edit-Lambda',
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
    const lambdaIntegrationEditContentPlanPost = new apigateway.LambdaIntegration(EditContentPlanPostLambda);
    lambdaEdutContentPlanPostsResource.addMethod('PUT', lambdaIntegrationEditContentPlanPost);

    //удаление опции оплаты
    const DeleteContentPlanPostLambda = new NodejsFunction(that, 'DeleteContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'DeleteContentPlanPostLambda.ts'),
        handler: 'DeleteContentPlanPostHandler',
        functionName: 'react-ContentPlanPosts-Delete-Lambda',
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
    const lambdaIntegrationDeleteContentPlanPost = new apigateway.LambdaIntegration(DeleteContentPlanPostLambda);
    lambdaDeleteContentPlanPostsResource.addMethod('DELETE', lambdaIntegrationDeleteContentPlanPost);

    GrantAccessToDDB([ListContentPlanPostsLambda, AddContentPlanPostLambda, EditContentPlanPostLambda, DeleteContentPlanPostLambda, GetContentPlanPostLambda], tables);
}
