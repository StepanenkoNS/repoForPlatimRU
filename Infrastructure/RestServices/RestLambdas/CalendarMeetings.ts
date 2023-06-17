import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function CreateCalendarMeetingsLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз

    // const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-CreateCalendarMeetingsLambdas', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    // const statementSQSCascadeDeleteQueue = new PolicyStatement({
    //     resources: [CascadeDeleteQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    const ListMeetingsLambda = new NodejsFunction(that, 'ListMeetingsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'ListMeetingsLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-List-Lambda',
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
    const GetMeetingLambda = new NodejsFunction(that, 'GetMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'GetMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Get-Lambda',
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
    const AddMeetingLambda = new NodejsFunction(that, 'AddMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'AddMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Add-Lambda',
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
    const EditMeetingLambda = new NodejsFunction(that, 'EditMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'EditMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Edit-Lambda',
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
    const DeleteMeetingLambda = new NodejsFunction(that, 'DeleteMeetingLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'DeleteMeetingLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-Delete-Lambda',
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

    //Список участников встречи
    const ListMeetingParticipantsLambda = new NodejsFunction(that, 'ListMeetingParticipantsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'ListMeetingParticipants.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-ListParticipants-Lambda',
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
    const CheckAddMeetingSubscriptionLambda = new NodejsFunction(that, 'CheckAddMeetingSubscriptionLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Meetings', 'CheckAddMeetingSubscriptionLambda.ts'),
        handler: 'handler',
        functionName: 'react-Meetings-CheckLimits-AddMeeting-Lambda',
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

    // GrantAccessToDDB([ListMeetingsLambda, AddMeetingLambda, GetMeetingLambda, EditMeetingLambda, DeleteMeetingLambda, ListMeetingParticipantsLambda, CheckAddMeetingSubscriptionLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListMeetingsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: AddMeetingLambda,
        resource: 'Add',
        httpMethod: 'POST'
    });
    returnArray.push({
        lambda: GetMeetingLambda,
        resource: 'Get',
        httpMethod: 'GET'
    });
    returnArray.push({
        lambda: EditMeetingLambda,
        resource: 'Edit',
        httpMethod: 'PUT'
    });

    returnArray.push({
        lambda: DeleteMeetingLambda,
        resource: 'Delete',
        httpMethod: 'DELETE'
    });

    returnArray.push({
        lambda: ListMeetingParticipantsLambda,
        resource: 'ListParticipants',
        httpMethod: 'GET'
    });

    returnArray.push({
        lambda: CheckAddMeetingSubscriptionLambda,
        resource: 'CheckAddMeetingLimit',
        httpMethod: 'GET'
    });
    return returnArray;
}
