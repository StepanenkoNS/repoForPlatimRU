import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateCampaignsInternalLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListCampaignsLambda = new NodejsFunction(that, 'ListCampaignsInternalLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'ListCampaignsLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsInternal-List-Lambda',
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
    const GetCampaignLambda = new NodejsFunction(that, 'GetCampaignInternalLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'GetCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsInternal-Get-Lambda',
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
    const AddCampaignLambda = new NodejsFunction(that, 'AddCampaignInternalLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'AddCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsInternal-Add-Lambda',
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
    const EditCampaignLambda = new NodejsFunction(that, 'EditCampaignInternalLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'EditCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsInternal-Edit-Lambda',
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
    const DeleteCampaignLambda = new NodejsFunction(that, 'DeleteCampaignInternalLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'Internal', 'DeleteCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsInternal-Delete-Lambda',
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
