import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';

import { GrantAccessToDDB } from '/opt/DevHelpers/AccessHelper';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

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
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    GrantAccessToDDB([CleanupChannelLambda], tables);
    const eventRule: events.Rule = new events.Rule(that, 'oneHourCleanupChannels', {
        schedule: events.Schedule.rate(Duration.hours(1)),
        ruleName: 'oneHourCleanupChannels'
    });

    eventRule.addTarget(
        new targets.LambdaFunction(CleanupChannelLambda, {
            event: events.RuleTargetInput.fromObject({ message: 'Hello Lambda' })
        })
    );
    targets.addLambdaPermission(eventRule, CleanupChannelLambda);
}
