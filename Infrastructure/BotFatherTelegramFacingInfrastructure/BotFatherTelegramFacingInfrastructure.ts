

import { CfnOutput, Duration, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { LambdaIntegration, RestApi, Deployment, Stage, MethodLoggingLevel } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { DeduplicationScope, FifoThroughputLimit, Queue } from 'aws-cdk-lib/aws-sqs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
//@ts-ignore
import * as DynamicEnvironment from '../../../ReadmeAndConfig/DynamicEnvironment';
//@ts-ignore
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';


export class BotFatherTelegramFacingInfrastructureStack extends Stack {


    private TelegramFacingAPI = new RestApi(this, 'BotFather-TelegramFacingAPI-GW', {deploy: false});
    incomingBotEvents_SQS: Queue;
    incomingBotEvents_SQSdlq: Queue;


    constructor (scope: Construct, id:string, props: StackProps & {
        redeployGateWayEachTime: boolean
    }){
        super(scope, id, props);

        const incomingBotEvents_SQSdlq = new Queue(this,'BotFather-incomingBotEvents_dlq.fifo', {
                fifo: true,
                queueName: 'BotFather-incomingBotEvents_dlq.fifo',
                deduplicationScope: DeduplicationScope.MESSAGE_GROUP,
                fifoThroughputLimit: FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
                visibilityTimeout: Duration.seconds(10)
            });
       
        const incomingBotEvents_SQS = new Queue(this, 'BotFather-incomingBotEvents.fifo', {
                fifo: true,
                queueName: 'BotFather-incomingBotEvents.fifo',
                deduplicationScope: DeduplicationScope.MESSAGE_GROUP,
                fifoThroughputLimit: FifoThroughputLimit.PER_MESSAGE_GROUP_ID,
                deadLetterQueue: {
                    queue: incomingBotEvents_SQSdlq,
                    maxReceiveCount: 3
                },
                visibilityTimeout: Duration.seconds(10)
            });
        this.incomingBotEvents_SQS = incomingBotEvents_SQS;

        const queueIncomingBotEventsLambda = new NodejsFunction(this, 'BotFather-queueIncomingBotEvent-Lambda', {
            entry: (join(__dirname, '..', '..', 'services','TelegramFacingQueue', 'queueIncomingTelegramBotEvents.ts')),
            handler: 'queueIncomingTelegramBotEvents',
            functionName: 'BotFather-queueIncomingTelegramBotEvents-Lambda',
            timeout: Duration.seconds(3),
            runtime:Runtime.NODEJS_16_X,
            environment: {
                api_version: 'v1',
                incomingBotEvents_SQS: incomingBotEvents_SQS.queueUrl,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                tg_api_serverURI: StaticEnvironment.EnvironmentVariables.tg_api_serverURI
            },
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]               
            }
        });      
        const statementSQS = new PolicyStatement({
            resources: [incomingBotEvents_SQS.queueArn],
            actions: ["sqs:SendMessage","sqs:GetQueueAttributes","sqs:GetQueueUrl"],
            effect:Effect.ALLOW
        })  
        queueIncomingBotEventsLambda.addToRolePolicy(statementSQS); 

        const lambdaIntegrationObjSendShortMessage = new LambdaIntegration(queueIncomingBotEventsLambda);
        const deploymentId = 'BotFather-TelegramFacingAPI-GW-deployment';
                  
        this.TelegramFacingAPI.root.addProxy({
            anyMethod:true,
            defaultIntegration: lambdaIntegrationObjSendShortMessage
        })

        const deployment = new Deployment(this, deploymentId, {
            api:this.TelegramFacingAPI,
            description: (props.redeployGateWayEachTime === true ? '-' + new Date().toISOString() : '')
        });


        const msgBotProductionStage = new Stage(this, 'BotFather-TelegramFacingAPI-GW-stage-production', {
            deployment,
            stageName: 'prod',
            metricsEnabled: true,
            loggingLevel: MethodLoggingLevel.INFO 
        });

        this.incomingBotEvents_SQSdlq = incomingBotEvents_SQSdlq;                   
        this.incomingBotEvents_SQS = incomingBotEvents_SQS;

    }


}
