import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateSendMessagesLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Отправка сообщения себе
    const SendTestMessageLambda = new NodejsFunction(that, 'SendTestMessageLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessage', 'SendTestMessageLambda.ts'),
        handler: 'handler',
        functionName: 'react-SendMessages-SendTestMessage-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Отправка файла себе
    const SendTestFileLambda = new NodejsFunction(that, 'SendTestFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessage', 'SendTestFileLambda.ts'),
        handler: 'handler',
        functionName: 'react-SendMessages-SendTestFile-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Отправка сообщения от админа пользователю себе
    const SendDirectMessageFromAdminLambda = new NodejsFunction(that, 'SendDirectMessageFromAdminLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'SendMessage', 'SendDirectMessageFromAdminLambda.ts'),
        handler: 'handler',
        functionName: 'react-SendMessages-SendDirectMessageFromAdmin-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //GrantAccessToDDB([SendTestMessageLambda, SendTestFileLambda, SendDirectMessageFromAdminLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: SendTestMessageLambda,
        resource: 'SendTestMessage',
        httpMethod: 'POST'
    });
    returnArray.push({
        lambda: SendTestFileLambda,
        resource: 'SendTestFile',
        httpMethod: 'POST'
    });
    returnArray.push({
        lambda: SendDirectMessageFromAdminLambda,
        resource: 'SendDirectMessage',
        httpMethod: 'POST'
    });

    return returnArray;
}
