import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from 'opt/DevHelpers/AccessHelper';

import { Queue } from 'aws-cdk-lib/aws-sqs';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function CreateContentPlanPostsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз
    const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateContentPlanPostsLambdas', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    const AddScheduledPostQueue = Queue.fromQueueArn(that, 'imported-AddScheduledPostQueue-CreateContentPlanPostsLambdas', DynamicEnvironment.SQS.ContentPlanPostScheduler.AddPost.basicSQS_arn);

    const DeleteScheduledPostQueue = Queue.fromQueueArn(
        that,
        'imported-DeleteScheduledPostQueue-CreateContentPlanPostsLambdas',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.DeletePost.basicSQS_arn
    );

    // const statementSQS = new PolicyStatement({
    //     resources: [AddScheduledPostQueue.queueArn, DeleteScheduledPostQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    //Вывод списка
    const ListContentPlanPostsLambda = new NodejsFunction(that, 'ListContentPlanPostsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'ListContentPlanPostsLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-List-Lambda',
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
    const GetContentPlanPostLambda = new NodejsFunction(that, 'GetContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'GetContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Get-Lambda',
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

    //Добавлении типа подписки
    const AddContentPlanPostLambda = new NodejsFunction(that, 'AddContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'AddContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Add-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            AddScheduledPostQueueURL: AddScheduledPostQueue.queueUrl,
            DeleteScheduledPostQueueURL: DeleteScheduledPostQueue.queueUrl
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });
    //AddContentPlanPostLambda.addToRolePolicy(statementSQS);

    //редактирование опции оплаты
    const EditContentPlanPostLambda = new NodejsFunction(that, 'EditContentPlanPostLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'ContentPlanPosts', 'EditContentPlanPostLambda.ts'),
        handler: 'handler',
        functionName: 'react-ContentPlanPosts-Edit-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MEDIUM,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
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
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            AddScheduledPostQueueURL: AddScheduledPostQueue.queueUrl,
            DeleteScheduledPostQueueURL: DeleteScheduledPostQueue.queueUrl,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', 'opt/*']
        },
        layers: layers
    });
    // DeleteContentPlanPostLambda.addToRolePolicy(statementSQS);
    // DeleteContentPlanPostLambda.addToRolePolicy(statementSQSCascadeDeleteQueue);
    // GrantAccessToDDB([ListContentPlanPostsLambda, AddContentPlanPostLambda, EditContentPlanPostLambda, DeleteContentPlanPostLambda, GetContentPlanPostLambda], tables);

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
