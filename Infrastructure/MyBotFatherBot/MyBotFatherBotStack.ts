import {CfnOutput, Duration, Fn, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime,LayerVersion, Code } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Queue } from 'aws-cdk-lib/aws-sqs';
//@ts-ignore
import * as DynamicEnvironment from '../../../ReadmeAndConfig/DynamicEnvironment';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';

import { Table } from 'aws-cdk-lib/aws-dynamodb';



export class MyBotFatherStack extends Stack {

    constructor (scope: Construct, id:string, props: StackProps & {
        incomingBotEventsSQS: Queue,
        incomingBotEventsSQSdlq: Queue
    }){
        super(scope, id, props);


        const i18Layer = LayerVersion.fromLayerVersionArn(this,'i18n-imported',DynamicEnvironment.Layers.LayerI18Narn);
        const composePostLayer = LayerVersion.fromLayerVersionArn(this,'SendPost-imported',DynamicEnvironment.Layers.ComposePostLayer);
        const conversationLayer = LayerVersion.fromLayerVersionArn(this,'Conversations-imported',DynamicEnvironment.Layers.ConversationsLayer);
        const typesLayer = LayerVersion.fromLayerVersionArn(this,'Types-imported',DynamicEnvironment.Layers.TypesLayer);

        const messagingBotLambda = new NodejsFunction(this, 'BotFather-Lambda', {
            entry: (join(__dirname, '..', '..', 'services','BotFatherBot', 'BotFather-Lambda.ts')),
            handler: 'botFatherHandler',
            runtime:Runtime.NODEJS_16_X,
            functionName: 'BotFather-Lambda',
            timeout: Duration.seconds(10),
            bundling: {
                externalModules: [
                    'aws-sdk',
                    '/opt/i18n',
                    '/opt/ComposePost',
                    '/opt/ConversationMenuRoutine',
                    '/opt/ConversationValidators',
                    '/opt/ConfiguratorTypes',
                    '/opt/PaymentTypes',
                    '/opt/SessionDataInterfaces',
                    '/opt/SubscriptionTypes',
                    '/opt/TelegramTypes',
                ]               
            },            
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                messagesTable: StaticEnvironment.DynamoDbTables.messagesTable.name,
                sessionsTable: StaticEnvironment.DynamoDbTables.sessionsTable.name,
                s3BotsBucket: StaticEnvironment.S3.botsBucketName,
                //messageBotTelegramFacingGW: DynamicEnvironment.GateWays.messageBotTelegramFacingGW,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                BOT_FATHER_TOKEN: StaticEnvironment.EnvironmentVariables.BOT_FATHER_TOKEN,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                createPostTemplateSQSSURL: DynamicEnvironment.SQS.createPostTemplateSQS.URL,
                tg_api_serverURI: StaticEnvironment.EnvironmentVariables.tg_api_serverURI
            },
            layers: [
                i18Layer,
                composePostLayer,
                conversationLayer,
                typesLayer
            ]
            
        })
        
     
        const eventSourceIncomingEvent = new SqsEventSource(props.incomingBotEventsSQS, {
            enabled: true,
            reportBatchItemFailures: false,
            batchSize:1
        });        

        const eventSourceIncomingEventDlq = new SqsEventSource(props.incomingBotEventsSQSdlq, {
            enabled: false,
            reportBatchItemFailures: false,
            batchSize:1
        });               

        messagingBotLambda.addEventSource(eventSourceIncomingEvent);
        messagingBotLambda.addEventSource(eventSourceIncomingEventDlq);


        const statementSecretsManager = new PolicyStatement({
            resources: ['*'],
            actions: ["secretsmanager:*"],
            effect:Effect.ALLOW
        })  
        messagingBotLambda.addToRolePolicy(statementSecretsManager);

        const statementS3 = new PolicyStatement({
            resources: ["arn:aws:s3:::"+StaticEnvironment.S3.botsBucketName+"/*"],
            actions: ["s3:*"],
            effect:Effect.ALLOW,
        });
        messagingBotLambda.addToRolePolicy(statementS3);           

        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);
        const sessionsTable = Table.fromTableName(this, 'imported-telegrafSessionsTable', StaticEnvironment.DynamoDbTables.sessionsTable.name);

        botsTable.grantReadWriteData(messagingBotLambda);
        sessionsTable.grantReadWriteData(messagingBotLambda);
          
    }
}