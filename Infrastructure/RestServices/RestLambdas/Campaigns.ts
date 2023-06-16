import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function CreateCampaignsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListCampaignsLambda = new NodejsFunction(that, 'ListCampaignsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'ListCampaignsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-List-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetCampaignLambda = new NodejsFunction(that, 'GetCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'GetCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Добавление
    const AddCampaignLambda = new NodejsFunction(that, 'AddCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'AddCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //редактирование
    const EditCampaignLambda = new NodejsFunction(that, 'EditCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'EditCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //удаление
    const DeleteCampaignLambda = new NodejsFunction(that, 'DeleteCampaignLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'DeleteCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-Campaigns-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
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
