import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { addLambdaIntegration, addMethod, GrantAccessToDDB } from '../Helper';

export function CreateGetBotLandingLambda(that: any, rootResource: apigateway.Resource, enableAPICache: boolean, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const GetSubdomainLambda = new NodejsFunction(that, 'GetSubdomainLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'WebBotLandingPages', 'GetBotLanding.ts'),
        handler: 'GetBotLandingHandler',
        functionName: 'react-BotLanding-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const lambdaIntegrationWebPageContent = addLambdaIntegration(GetSubdomainLambda, enableAPICache);
    addMethod(rootResource, undefined, 'GET', lambdaIntegrationWebPageContent, enableAPICache);

    GrantAccessToDDB([GetSubdomainLambda], tables);
}
