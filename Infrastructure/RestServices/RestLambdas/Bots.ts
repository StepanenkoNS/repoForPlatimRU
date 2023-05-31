import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToRoute53, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function CreateBotsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз
    const deleteBotDataQueue = Queue.fromQueueArn(that, 'imported-deleteBotDataQueue-forCreateBotsLambdas', DynamicEnvironment.SQS.deleteBotDataQueue.basicSQS_arn);

    const deleteBotDataQueueDLQ = Queue.fromQueueArn(that, 'imported-deleteBotDataQueueDLQ-forCreateBotsLambdas', DynamicEnvironment.SQS.deleteBotDataQueue.dlqSQS_arn);

    const ListBotsLambda = new NodejsFunction(that, 'ListBotsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'ListBotsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetBotLambda = new NodejsFunction(that, 'GetBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'GetBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //Добавление
    const AddBotLambda = new NodejsFunction(that, 'AddBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'AddBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //регистрация
    const RegisterBotLambda = new NodejsFunction(that, 'RegisterBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'RegisterBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Register-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //отмена регистрации
    const UnRegisterBotLambda = new NodejsFunction(that, 'UnRegisterBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'UnRegisterBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-UnRegister-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //редактирование
    const EditBotLambda = new NodejsFunction(that, 'EditBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'EditBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    //удаление
    const DeleteBotLambda = new NodejsFunction(that, 'DeleteBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'DeleteBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const DeleteBotDataLambda = new NodejsFunction(that, 'DeleteBotDataLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'DeleteBotDataLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-DeleteData-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            deleteBotDataQueueURL: deleteBotDataQueue.queueUrl,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    const eventDeleteBotData = new SqsEventSource(deleteBotDataQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventDeleteBotDataDLQ = new SqsEventSource(deleteBotDataQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    DeleteBotDataLambda.addEventSource(eventDeleteBotData);
    DeleteBotDataLambda.addEventSource(eventDeleteBotDataDLQ);

    GrantAccessToRoute53([AddBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda]);

    GrantAccessToDDB([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda, DeleteBotDataLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListBotsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddBotLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });
    returnArray.push({
        lambda: GetBotLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: EditBotLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });
    returnArray.push({
        lambda: RegisterBotLambda,
        resource: 'Register',
        httpMethod: 'PUT'
    });
    returnArray.push({
        lambda: UnRegisterBotLambda,
        resource: 'UnRegister',
        httpMethod: 'PUT'
    });
    returnArray.push({
        lambda: DeleteBotLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
