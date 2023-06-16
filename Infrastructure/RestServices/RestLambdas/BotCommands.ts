import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateBotCommandsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    const ListBotCommandsLambda = new NodejsFunction(that, 'ListBotCommandsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'ListBotCommandsLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-List-Lambda',
        role: lambdaRole,
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetBotCommandLambda = new NodejsFunction(that, 'GetBotCommandLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'GetBotCommandLambda.ts'),
        handler: 'handler',
        role: lambdaRole,
        functionName: 'react-BotCommands-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //редактирование
    const EditBotCommandLambda = new NodejsFunction(that, 'EditBotCommandLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'EditBotCommandLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListBotCommandsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: GetBotCommandLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: EditBotCommandLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    return returnArray;
}
