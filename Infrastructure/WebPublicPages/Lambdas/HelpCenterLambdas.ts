import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import { addLambdaIntegration, addMethod, GrantAccessToDDB } from '../Helper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateHelpCenterLambdas(that: any, rootResource: apigateway.Resource, enableAPICache: boolean, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    const getHCLangingLambda = new NodejsFunction(that, 'GetHCLandingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebPublicPages', 'HC-LandingLambda.ts'),
        handler: 'handler',
        functionName: 'react-HelpCenter-Landing-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        role: lambdaRole,
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

    const lambdaIntegrationHCLanging = addLambdaIntegration(getHCLangingLambda, enableAPICache);
    addMethod(rootResource, 'landing', 'GET', lambdaIntegrationHCLanging, enableAPICache);

    const getHCsubcategoryLambda = new NodejsFunction(that, 'GetHCsubcategoryLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebPublicPages', 'HC-SubCategoryLambda.ts'),
        handler: 'handler',
        functionName: 'react-HelpCenter-Subcategory-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        role: lambdaRole,
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
    const lambdaIntegrationHCSubCategory = addLambdaIntegration(getHCsubcategoryLambda, enableAPICache);
    addMethod(rootResource, 'subcategory', 'GET', lambdaIntegrationHCSubCategory, enableAPICache);

    const getHCArticleLambda = new NodejsFunction(that, 'GetHCArticleLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebPublicPages', 'HC-ArticleLambda.ts'),
        handler: 'handler',
        functionName: 'react-HelpCenter-Article-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        role: lambdaRole,
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

    const lambdaIntegrationHCArticle = addLambdaIntegration(getHCArticleLambda, enableAPICache);
    addMethod(rootResource, 'article', 'GET', lambdaIntegrationHCArticle, enableAPICache);
}
