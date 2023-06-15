import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function CreateCampaignsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListCampaignsLambda = new NodejsFunction(that, 'ListCampaignsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'ListCampaignsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetCampaignLambda = new NodejsFunction(that, 'GetCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'GetCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Добавление
    const AddCampaignLambda = new NodejsFunction(that, 'AddCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'AddCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //редактирование
    const EditCampaignLambda = new NodejsFunction(that, 'EditCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'EditCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление
    const DeleteCampaignLambda = new NodejsFunction(that, 'DeleteCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'DeleteCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //предоставление доступа

    // DeleteCampaignLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);

    // GrantAccessToDDB([ListCampaignsLambda, AddCampaignLambda, EditCampaignLambda, DeleteCampaignLambda, GetCampaignLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListCampaignsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetCampaignLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddCampaignLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditCampaignLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteCampaignLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
