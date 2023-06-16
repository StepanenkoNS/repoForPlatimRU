import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateBotMenuSettingsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод одного элемента
    const GetBotMenuSettingsLambda = new NodejsFunction(that, 'GetBotMenuSettingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotMenuSettings', 'GetBotMenu.ts'),
        handler: 'handler',
        role: lambdaRole,
        functionName: 'react-BotMenuSettings-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //редактирование
    const EditBotMenuSettingsLambda = new NodejsFunction(that, 'EditBotMenuSettingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotMenuSettings', 'EditBotMenu.ts'),
        handler: 'handler',
        functionName: 'react-BotMenuSettings-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    const returnArray: LambdaAndResource[] = [];

    returnArray.push({
        lambda: GetBotMenuSettingsLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: EditBotMenuSettingsLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    return returnArray;
}
