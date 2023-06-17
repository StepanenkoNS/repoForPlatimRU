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

export function CreateCampaignsUTMLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    //Вывод списка
    const ListCampaignsLambda = new NodejsFunction(that, 'ListCampaignsUTMLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'UTM', 'ListCampaignsLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsUTM-List-Lambda',
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
    const GetCampaignLambda = new NodejsFunction(that, 'GetCampaignUTMLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'UTM', 'GetCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsUTM-Get-Lambda',
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
    const AddCampaignLambda = new NodejsFunction(that, 'AddCampaignUTMLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'UTM', 'AddCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsUTM-Add-Lambda',
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
    const EditCampaignLambda = new NodejsFunction(that, 'EditCampaignUTMLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'UTM', 'EditCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsUTM-Edit-Lambda',
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
    const DeleteCampaignLambda = new NodejsFunction(that, 'DeleteCampaignUTMLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Campaigns', 'UTM', 'DeleteCampaignLambda.ts'),
        handler: 'handler',
        functionName: 'react-CampaignsUTM-Delete-Lambda',
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
