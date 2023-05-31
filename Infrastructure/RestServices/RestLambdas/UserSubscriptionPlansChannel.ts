import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

export function CreateUserSubscriptionPlansChannelsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListUserSubscriptionPlansChannelsLambda = new NodejsFunction(that, 'ListUserSubscriptionPlansChannelsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansChannel', 'ListUserSubscriptionPlansLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansChannel-List-Lambda',
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
    const GetSubscriptionPlanChannelLambda = new NodejsFunction(that, 'GetSubscriptionPlanChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansChannel', 'GetUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansChannel-Get-Lambda',
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

    //Добавлении типа подписки
    const AddSubscriptionPlanChannelLambda = new NodejsFunction(that, 'AddSubscriptionPlanChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansChannel', 'AddUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansChannel-Add-Lambda',
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

    //редактирование опции оплаты
    const EditSubscriptionPlanChannelLambda = new NodejsFunction(that, 'EditSubscriptionPlanChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansChannel', 'EditUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansChannel-Edit-Lambda',
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

    //удаление опции оплаты
    const DeleteSubscriptionPlanChannelLambda = new NodejsFunction(that, 'DeleteSubscriptionPlanChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlansChannel', 'DeleteUserSubscriptionPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-UserSubscriptionPlansChannel-Delete-Lambda',
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

    GrantAccessToDDB(
        [ListUserSubscriptionPlansChannelsLambda, AddSubscriptionPlanChannelLambda, EditSubscriptionPlanChannelLambda, DeleteSubscriptionPlanChannelLambda, GetSubscriptionPlanChannelLambda],
        tables
    );

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListUserSubscriptionPlansChannelsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetSubscriptionPlanChannelLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddSubscriptionPlanChannelLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditSubscriptionPlanChannelLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteSubscriptionPlanChannelLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
