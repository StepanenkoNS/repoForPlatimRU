import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToRoute53, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';

import { Queue } from 'aws-cdk-lib/aws-sqs';

import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function CreateBotsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    const ListBotsLambda = new NodejsFunction(that, 'ListBotsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'ListBotsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-List-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetBotLambda = new NodejsFunction(that, 'GetBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'GetBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //Добавление
    const AddBotLambda = new NodejsFunction(that, 'AddBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'AddBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //регистрация
    const RegisterBotLambda = new NodejsFunction(that, 'RegisterBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'RegisterBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Register-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //отмена регистрации
    const UnRegisterBotLambda = new NodejsFunction(that, 'UnRegisterBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'UnRegisterBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-UnRegister-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //редактирование
    const EditBotLambda = new NodejsFunction(that, 'EditBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'EditBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    //удаление
    const DeleteBotLambda = new NodejsFunction(that, 'DeleteBotLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Bots', 'DeleteBotLambda.ts'),
        handler: 'handler',
        functionName: 'react-Bots-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SHORT,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettings.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    // DeleteBotLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);
    // GrantAccessToRoute53([AddBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda]);

    // GrantAccessToDDB([ListBotsLambda, AddBotLambda, GetBotLambda, EditBotLambda, DeleteBotLambda, RegisterBotLambda, UnRegisterBotLambda], tables);

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
