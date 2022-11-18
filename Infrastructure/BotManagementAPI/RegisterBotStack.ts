import {CfnOutput, Fn, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import { LambdaIntegration, RestApi, Deployment, Stage, MethodLoggingLevel, ApiKey, Period } from 'aws-cdk-lib/aws-apigateway';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as DynamicEnvironment from '../../../ReadmeAndConfig/DynamicEnvironment';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

export class RegisterBotStack extends Stack {

    private redeployGateWayEachTime = false; 
    private servicePrefix : string = 'botManagement-';
    private gwAPIpostfix : string = 'GWapi';
    private RegisterBotAPI = new RestApi(
        this, 
        this.servicePrefix+this.gwAPIpostfix
        , {deploy: false});
    private apiKey : ApiKey;
    private apiKeyRequired = false;
    

    constructor (scope: Construct, id:string, props: StackProps & {
        apiKey: ApiKey

    }){
        super(scope, id, props);

        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);
        const telegramFacingAPIurl = Fn.importValue('telegramFacingAPIurl');

        if (props.apiKey) {
            this.apiKey = props.apiKey;
            this.apiKeyRequired = true;
        }
        const AddBotLambda =  new NodejsFunction(this, 'AddBotLambda', {
            entry: (join(__dirname, '..', '..', 'services','RegisterBot', 'addBot.ts')),
            handler: 'handler',
            functionName: this.servicePrefix+'addBot-Lambda',
            runtime:Runtime.NODEJS_16_X,
            environment: {
                telegramFacingAPIurl: telegramFacingAPIurl,
                api_version: 'MessageBotIntegration/v1',
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV
            },
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]               
            }
        })
        const statement = new PolicyStatement({
            actions: ["secretsmanager:*"],
            resources: ['*'],
            effect:Effect.ALLOW
        })  
        AddBotLambda.addToRolePolicy(statement);
        
        botsTable.grantReadWriteData(AddBotLambda);

        
        const GetBotLambda = new NodejsFunction(this, 'GetBotLambda', {
            entry: (join(__dirname, '..', '..', 'services','RegisterBot', 'getBot.ts')),
            handler: 'handler',
            runtime:Runtime.NODEJS_16_X,
            functionName: this.servicePrefix+'getBot-Lambda',
            environment: {
                telegramFacingAPIurl: telegramFacingAPIurl,
                api_version: 'MessageBotIntegration/v1',
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV
            },
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]               
            }
        });

        GetBotLambda.addToRolePolicy(statement);
        botsTable.grantReadWriteData(GetBotLambda); 

        const UnregisterBotLambda = new NodejsFunction(this, 'DeleteBotLambda', {
            entry: (join(__dirname, '..', '..', 'services','RegisterBot', 'deleteBot.ts')),
            handler: 'handler',
            runtime:Runtime.NODEJS_16_X,
            functionName: this.servicePrefix+'DeleteBot-Lambda',
            environment: {
                telegramFacingAPIurl: telegramFacingAPIurl,
                api_version: 'MessageBotIntegration/v1',
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                tg_api_serverURI: StaticEnvironment.EnvironmentVariables.tg_api_serverURI
            }
        })    
        UnregisterBotLambda.addToRolePolicy(statement);
        botsTable.grantReadWriteData(UnregisterBotLambda);
        

        const lambdaIntegrationObjAdd = new LambdaIntegration(AddBotLambda);
        const lambdaIntegrationObjGet = new LambdaIntegration(GetBotLambda);
        const lambdaIntegrationObjDelete = new LambdaIntegration(UnregisterBotLambda);

        const lambdaResource_v1 = this.RegisterBotAPI.root.addResource('BotManagement').addResource('v1');
        

        const v1_post = lambdaResource_v1.addMethod('POST',lambdaIntegrationObjAdd, {
            apiKeyRequired: this.apiKeyRequired
        });
        const v1_detele = lambdaResource_v1.addMethod('DELETE',lambdaIntegrationObjDelete, {
            apiKeyRequired: this.apiKeyRequired
        });        

        const v1_get = lambdaResource_v1.addMethod('GET',lambdaIntegrationObjGet, {
            apiKeyRequired: this.apiKeyRequired
        });  

        const deploymentId =this.servicePrefix+this.gwAPIpostfix+ '-deployment' + (this.redeployGateWayEachTime === true ? '-' + new Date().toISOString() : '');

        const deployment = new Deployment(this, deploymentId, {
            api:this.RegisterBotAPI,
            //description : new Date().toISOString()
        });


        // const productionStage = new Stage(this, 'BotManagementGWapi-stage-production', {
        //     deployment,
        //     stageName: 'prod',
        //     metricsEnabled: true,
        //     loggingLevel: MethodLoggingLevel.INFO 
        // });

        const testStage = new Stage(this, this.servicePrefix+this.gwAPIpostfix+'stage-test', {
            deployment,
            stageName: 'test',
            metricsEnabled: true,
            loggingLevel: MethodLoggingLevel.INFO 
        });        

        const usagePlan = this.RegisterBotAPI.addUsagePlan(this.servicePrefix+this.gwAPIpostfix+"-UsagePlan", {
            name: this.servicePrefix+this.gwAPIpostfix+"-UsagePlan",
            
            apiStages: [
                        //{api: this.RegisterBotAPI, stage: productionStage},
                        {api: this.RegisterBotAPI, stage: testStage}
                    ],
            throttle: {burstLimit: 2, rateLimit: 100}, 
            quota: {limit: 10000000, period: Period.MONTH},
        });
        if (this.apiKeyRequired) {
            usagePlan.addApiKey(this.apiKey, {});
        }

        new CfnOutput(this, this.servicePrefix+this.gwAPIpostfix+ 'Test', {
            value: testStage.urlForPath(),
            exportName: this.servicePrefix+this.gwAPIpostfix+'Test'
          });
         
    }


}

//HFTaoNgzHM9Wf7mq3wuygYU4jS41IlfaYIKAOtj7