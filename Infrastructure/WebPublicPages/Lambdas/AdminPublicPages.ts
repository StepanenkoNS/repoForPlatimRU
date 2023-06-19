import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import { addLambdaIntegration, addMethod, GrantAccessToDDB } from '../Helper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateAdminPublicPagesLambdas(that: any, rootResource: apigateway.Resource, enableAPICache: boolean, layers: ILayerVersion[], lambdaPublicPagesRole: IRole) {
    //добавление ресурсов в шлюз

    const getWebPageContentLambda = new NodejsFunction(that, 'GetWebPageContentLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebPublicPages', 'Admin-GetPageContent.ts'),
        handler: 'handler',
        functionName: 'react-PublicPage-adminContent-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        role: lambdaPublicPagesRole,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        environment: {
            webTable: StaticEnvironment.DynamoDbTables.webTable.name,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    const lambdaIntegrationWebPageContent = addLambdaIntegration(getWebPageContentLambda, enableAPICache);
    addMethod(rootResource, undefined, 'GET', lambdaIntegrationWebPageContent, enableAPICache);
}
