import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateCRMLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const crmListMyUsersLambda = new NodejsFunction(that, 'crmListMyUsersLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ListMyUsers.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Users-List-Lambda',
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

    const crmBotSubscriptionsLambda = new NodejsFunction(that, 'crmBotSubscriptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'BotSubscriptions.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Bot-Subscriptions-Lambda',
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

    const crmChannelSubscriptionsLambda = new NodejsFunction(that, 'crmChannelSubscriptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'ChannelSubscriptions.ts'),
        handler: 'handler',
        functionName: 'react-CRM-Channel-Subscriptions-Lambda',
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

    const crmUserProfileLambda = new NodejsFunction(that, 'crmUserProfileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CRM', 'GetMyUserProfile.ts'),
        handler: 'handler',
        functionName: 'react-CRM-UserProfile-Lambda',
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

    //предоставление доступа
    GrantAccessToDDB([crmListMyUsersLambda, crmChannelSubscriptionsLambda, crmBotSubscriptionsLambda, crmUserProfileLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: crmListMyUsersLambda,
        resource: 'ListMyUsers',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmBotSubscriptionsLambda,
        resource: 'ListMyBotSubscriptions',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: crmChannelSubscriptionsLambda,
        resource: 'ListMyChannelsSubscriptions',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: crmUserProfileLambda,
        resource: 'UserProfile',
        httpMethod: 'GET'
    });

    return returnArray;
}
