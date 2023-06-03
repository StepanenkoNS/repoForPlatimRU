import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';

//@ts-ignore
import { GrantAccessToDDB, GrantAccessToS3, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { IRole } from 'aws-cdk-lib/aws-iam';

export function CreateTelegramFilesLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //Вывод списка
    const ListTelegramFilesLambda = new NodejsFunction(that, 'ListTelegramFilesLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'ListTelegramFilesLambda.ts'),
        handler: 'handler',
        functionName: 'react-TelegramFiles-List-Lambda',
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
    const GetTelegramFileLambda = new NodejsFunction(that, 'GetTelegramFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'GetTelegramFileLambda.ts'),
        handler: 'handler',
        functionName: 'react-TelegramFiles-Get-Lambda',
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
    const EditTelegramFileLambda = new NodejsFunction(that, 'EditTelegramFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'EditTelegramFileLambda.ts'),
        handler: 'handler',
        functionName: 'react-TelegramFiles-Edit-Lambda',
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
    const DeleteTelegramFileLambda = new NodejsFunction(that, 'DeleteTelegramFileLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'TelegramFiles', 'DeleteTelegramFileLambda.ts'),
        handler: 'handler',
        functionName: 'react-TelegramFiles-Delete-Lambda',
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

    GrantAccessToDDB([ListTelegramFilesLambda, EditTelegramFileLambda, DeleteTelegramFileLambda, GetTelegramFileLambda], tables);

    GrantAccessToS3(
        [ListTelegramFilesLambda, EditTelegramFileLambda, DeleteTelegramFileLambda, GetTelegramFileLambda],
        [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]
    );

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListTelegramFilesLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetTelegramFileLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: EditTelegramFileLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteTelegramFileLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
