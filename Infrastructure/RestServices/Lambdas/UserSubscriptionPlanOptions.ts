import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateUserSubscriptionPlanOptionsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListUserSubscriptionPlanOptionsLambda = new NodejsFunction(that, 'ListUserSubscriptionPlanOptionsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'ListUserSubscriptionPlanOptionsLambda.ts'),
        handler: 'ListUserSubscriptionPlanOptionsHandler',
        functionName: 'react-UserSubscriptionPlanOptions-List-Lambda',
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

    //Вывод списка2
    const ListUserSubscriptionPlanOptionsListWithContentPlansLambda = new NodejsFunction(that, 'ListUserSubscriptionPlanOptionsListWithContentPlansLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'ListUserSubscriptionPlanOptionsWithContentLambda.ts'),
        handler: 'ListUserSubscriptionPlanOptionsWithContentHandler',
        functionName: 'react-UserSubscriptionPlanOptions-ListWithContentPlans-Lambda',
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
    const GetSubscriptionPlanLambda = new NodejsFunction(that, 'GetUserSubscriptionPlanOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'GetUserSubscriptionPlanOptionLambda.ts'),
        handler: 'GetUserSubscriptionPlanOptionHandler',
        functionName: 'react-UserSubscriptionPlanOptions-Get-Lambda',
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
    const AddSubscriptionPlanLambda = new NodejsFunction(that, 'AddUserSubscriptionPlanOptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'AddUserSubscriptionPlanOptionLambda.ts'),
        handler: 'AddUserSubscriptionPlanOptionHandler',
        functionName: 'react-UserSubscriptionPlanOptions-Add-Lambda',
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
    const DeleteSubscriptionPlanLambda = new NodejsFunction(that, 'DeleteUserSubscriptionPlaOptionnLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'UserSubscriptionPlanOptions', 'DeleteUserSubscriptionPlanOptionLambda.ts'),
        handler: 'DeleteUserSubscriptionPlanOptionHandler',
        functionName: 'react-UserSubscriptionPlanOptions-Delete-Lambda',
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
        [ListUserSubscriptionPlanOptionsLambda, AddSubscriptionPlanLambda, DeleteSubscriptionPlanLambda, GetSubscriptionPlanLambda, ListUserSubscriptionPlanOptionsListWithContentPlansLambda],
        tables
    );

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListUserSubscriptionPlanOptionsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: ListUserSubscriptionPlanOptionsListWithContentPlansLambda,
        resource: 'ListWithContentPlans',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetSubscriptionPlanLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddSubscriptionPlanLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: DeleteSubscriptionPlanLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
