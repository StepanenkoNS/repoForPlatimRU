import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { addLambdaIntegration, addMethod, GrantAccessToDDB } from '../Helper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreatePublicPagesLambdas(that: any, rootResource: apigateway.Resource, enableAPICache: boolean, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    const getWebPageContentLambda = new NodejsFunction(that, 'GetWebPageContentLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebPublicPages', 'WebPages-GetPageContent.ts'),
        handler: 'handler',
        functionName: 'react-Content-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        role: lambdaRole,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            webTable: StaticEnvironment.DynamoDbTables.webTable.name,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const lambdaIntegrationWebPageContent = addLambdaIntegration(getWebPageContentLambda, enableAPICache);
    addMethod(rootResource, undefined, 'GET', lambdaIntegrationWebPageContent, enableAPICache);
}
