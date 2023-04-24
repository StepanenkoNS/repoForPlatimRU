import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';

//@ts-ignore
import { GrantAccessToDDB, GrantAccessToS3 } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateChannelsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //Вывод списка
    const ListChannelsLambda = new NodejsFunction(that, 'ListChannelsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'ListChannelsLambda.ts'),
        handler: 'ListChannelsHandler',
        functionName: 'react-Channels-List-Lambda',
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
    const GetChannelLambda = new NodejsFunction(that, 'GetChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'GetChannelLambda.ts'),
        handler: 'GetChannelHandler',
        functionName: 'react-Channels-Get-Lambda',
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
    const EditChannelLambda = new NodejsFunction(that, 'EditChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'EditChannelLambda.ts'),
        handler: 'EditChannelHandler',
        functionName: 'react-Channels-Edit-Lambda',
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
    const DeleteChannelLambda = new NodejsFunction(that, 'DeleteChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Channels', 'DeleteChannelLambda.ts'),
        handler: 'DeleteChannelHandler',
        functionName: 'react-Channels-Delete-Lambda',
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

    GrantAccessToDDB([ListChannelsLambda, EditChannelLambda, DeleteChannelLambda, GetChannelLambda], tables);

    GrantAccessToS3([ListChannelsLambda, EditChannelLambda, DeleteChannelLambda, GetChannelLambda], [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListChannelsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetChannelLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: EditChannelLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteChannelLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
