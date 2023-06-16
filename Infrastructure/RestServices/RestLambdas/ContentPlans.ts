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

export function CreateContentPlansLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз
    const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateContentPlansLambdas', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    //Вывод списка
    const ListContentPlansLambda = new NodejsFunction(that, 'ListContentPlansLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'ListContentPlansLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlans-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //Вывод одного элемента
    const GetContentPlanLambda = new NodejsFunction(that, 'GetContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'GetContentPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlans-Get-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //Добавление
    const AddContentPlanLambda = new NodejsFunction(that, 'AddContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'AddContentPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlans-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //редактирование
    const EditContentPlanLambda = new NodejsFunction(that, 'EditContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'EditContentPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlans-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //удаление
    const DeleteContentPlanLambda = new NodejsFunction(that, 'DeleteContentPlanLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlans', 'DeleteContentPlanLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlans-Delete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });

    //предоставление доступа

    // DeleteContentPlanLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);

    // GrantAccessToDDB([ListContentPlansLambda, AddContentPlanLambda, EditContentPlanLambda, DeleteContentPlanLambda, GetContentPlanLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListContentPlansLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: GetContentPlanLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddContentPlanLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: EditContentPlanLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteContentPlanLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    return returnArray;
}
