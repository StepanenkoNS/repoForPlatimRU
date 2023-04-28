import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateContentPlanPostsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListContentPlanPostsLambda = new NodejsFunction(that, 'ListContentPlanPostsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'ListContentPlanPostsLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-List-Lambda',
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
    const GetContentPlanPostLambda = new NodejsFunction(that, 'GetContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'GetContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Get-Lambda',
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
    const AddContentPlanPostLambda = new NodejsFunction(that, 'AddContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'AddContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Add-Lambda',
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
    const EditContentPlanPostLambda = new NodejsFunction(that, 'EditContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'EditContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление опции оплаты
    const DeleteContentPlanPostLambda = new NodejsFunction(that, 'DeleteContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'DeleteContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Delete-Lambda',
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

    GrantAccessToDDB([ListContentPlanPostsLambda, AddContentPlanPostLambda, EditContentPlanPostLambda, DeleteContentPlanPostLambda, GetContentPlanPostLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListContentPlanPostsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetContentPlanPostLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddContentPlanPostLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditContentPlanPostLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteContentPlanPostLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
