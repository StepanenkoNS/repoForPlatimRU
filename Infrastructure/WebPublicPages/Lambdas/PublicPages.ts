import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { addLambdaIntegration, addMethod, GrantAccessToDDB } from '../Helper';

export function CreatePublicPagesLambdas(that: any, rootResource: apigateway.Resource, enableAPICache: boolean, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const getWebPageContentLambda = new NodejsFunction(that, 'GetWebPageContentLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebPublicPages', 'WebPages-GetPageContent.ts'),
        handler: 'GetWebPageContentHandler',
        functionName: 'react-Content-Get-Lambda',
        runtime: Runtime.NODEJS_16_X,
        environment: {
            webTable: StaticEnvironment.DynamoDbTables.webTable.name,
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

    const lambdaIntegrationWebPageContent = addLambdaIntegration(getWebPageContentLambda, enableAPICache);
    addMethod(rootResource, undefined, 'GET', lambdaIntegrationWebPageContent, enableAPICache);

    GrantAccessToDDB([getWebPageContentLambda], tables);
}
