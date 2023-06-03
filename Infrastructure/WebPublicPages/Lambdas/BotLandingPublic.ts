import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { addLambdaIntegration, addMethod, GrantAccessToDDB } from '../Helper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateGetBotLandingLambda(that: any, rootResource: apigateway.Resource, enableAPICache: boolean, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    const GetBotLandingPublicLambda = new NodejsFunction(that, 'GetBotLandingPublic', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotLanding', 'GetBotLandingPublic.ts'),
        handler: 'handler',
        functionName: 'react-BotLanding-GetPublic-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        role: lambdaRole,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const lambdaIntegrationWebPageContent = addLambdaIntegration(GetBotLandingPublicLambda, enableAPICache);
    addMethod(rootResource, undefined, 'GET', lambdaIntegrationWebPageContent, enableAPICache);
}
