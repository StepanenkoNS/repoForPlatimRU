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
import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Topic } from 'aws-cdk-lib/aws-sns';

export function CreateCascadeDelete(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    //добавление ресурсов в шлюз
    const DeleteScheduledPostQueue = Queue.fromQueueArn(
        that,
        'imported-DeleteScheduledPostQueue-CreateContentPlanPostsLambdas',
        DynamicEnvironment.SQS.ContentPlanPostScheduler.DeletePost.basicSQS_arn
    );

    const CascadeDeleteQueue = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueue-forCreateCascadeDelete', DynamicEnvironment.SQS.CascadeDeleteQueue.basicSQS_arn);

    const CascadeDeleteQueueDLQ = Queue.fromQueueArn(that, 'imported-CascadeDeleteQueueDLQ-forCreateCascadeDelete', DynamicEnvironment.SQS.CascadeDeleteQueue.dlqSQS_arn);

    // const statementSQS = new PolicyStatement({
    //     resources: [DeleteScheduledPostQueue.queueArn],
    //     actions: ['sqs:SendMessage', 'sqs:GetQueueAttributes', 'sqs:GetQueueUrl'],
    //     effect: Effect.ALLOW
    // });

    // const statementSNS = new PolicyStatement({
    //     resources: [cascadeDeleteTopic.topicArn],
    //     actions: ['sns:piblish'],
    //     effect: Effect.ALLOW
    // });

    const CascadeDeleteLambda = new NodejsFunction(that, 'CascadeDeleteLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CascadeDelete', 'CascadeDelete.ts'),
        handler: 'handler',
        functionName: 'react-CascadeDelete-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.MAX,
        role: lambdaRole,
        environment: {
            WebAppBotsSubdomainDistributionDomainName: DynamicEnvironment.CloudFront.WebAppBotsSubdomainDistributionDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            DeleteScheduledPostQueueURL: DeleteScheduledPostQueue.queueUrl,
            CascadeDeleteTopic: DynamicEnvironment.SNS.CascadeDeleteTopicARN
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    // CascadeDeleteLambda.addToRolePolicy(statementSQS);
    // CascadeDeleteLambda.addToRolePolicy(statementSNS);

    const eventSourceForCascadeDeleteLambda = new SqsEventSource(CascadeDeleteQueue, {
        enabled: true,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    const eventSourceForCascadeDeleteLambdaDLQ = new SqsEventSource(CascadeDeleteQueueDLQ, {
        enabled: false,
        reportBatchItemFailures: true,
        batchSize: 1
    });

    CascadeDeleteLambda.addEventSource(eventSourceForCascadeDeleteLambda);
    CascadeDeleteLambda.addEventSource(eventSourceForCascadeDeleteLambdaDLQ);
}
