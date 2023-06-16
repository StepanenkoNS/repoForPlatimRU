import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateBotSetLandingLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const UpdateBotLandingPage = new NodejsFunction(that, 'SetBotLandingPageLamda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotLanding', 'UpdateBotLanding.ts'),
        handler: 'handler',
        functionName: 'react-BotLanding-Update-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    const GetBotLandingPrivateLambda = new NodejsFunction(that, 'GetBotLandingPrivate', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotLanding', 'GetBotLandingPrivate.ts'),
        handler: 'handler',
        functionName: 'react-BotLanding-GetPrivate-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });
    //предоставление доступа

    //GrantAccessToDDB([UpdateBotLandingPage, GetBotLandingPrivateLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: UpdateBotLandingPage,
        resource: undefined,
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: GetBotLandingPrivateLambda,
        resource: undefined,
        httpMethod: 'GET'
    });
    return returnArray;
}
