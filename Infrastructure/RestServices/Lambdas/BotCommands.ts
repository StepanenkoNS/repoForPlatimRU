import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToRoute53, GrantAccessToSecrets } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateBotCommandsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const ListBotCommandsLambda = new NodejsFunction(that, 'ListBotCommandsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'ListBotCommandsLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-List-Lambda',
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

    //Вывод одного элемента
    const GetBotCommandLambda = new NodejsFunction(that, 'GetBotCommandLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'GetBotCommandLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-Get-Lambda',
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

    //Добавление
    const AddBotCommandLambda = new NodejsFunction(that, 'AddBotCommandLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'AddBotCommandLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-Add-Lambda',
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

    //редактирование
    const EditBotCommandLambda = new NodejsFunction(that, 'EditBotCommandLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'EditBotCommandLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            telegramFacingAPIurl: DynamicEnvironment.GateWays.messageBotTelegramFacingGW,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление
    const DeleteBotCommandLambda = new NodejsFunction(that, 'DeleteBotCommandLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotCommands', 'DeleteBotCommandLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotCommands-Delete-Lambda',
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

    GrantAccessToDDB([ListBotCommandsLambda, AddBotCommandLambda, GetBotCommandLambda, EditBotCommandLambda, DeleteBotCommandLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListBotCommandsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddBotCommandLambda,
        resource: 'Add',
        httpMethod: 'POST'
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

    returnArray.push({
        lambda: DeleteBotCommandLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
