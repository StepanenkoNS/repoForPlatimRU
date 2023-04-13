import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, GrantAccessToS3, ReturnGSIs } from '/opt/LambdaHelpers/AccessHelper';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { DeduplicationScope, FifoThroughputLimit, Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamoEventSource, SqsDlq, SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function CreateCleanupProcessor(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //Лямбда - принимает сообщение и запускает его обработку
    const CleanupChannelLambda = new NodejsFunction(that, 'CleanupChannelLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CleanUpProcessor', 'CleanUpChannelProcessor.ts'),
        handler: 'CleanUpChannelProcessorHandler',
        functionName: 'cleanupProcessor-Channels',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.LONG,
        reservedConcurrentExecutions: 1,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,

            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    GrantAccessToDDB([CleanupChannelLambda], tables);
}
