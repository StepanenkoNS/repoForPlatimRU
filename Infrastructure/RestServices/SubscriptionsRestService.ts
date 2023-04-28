import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateServiceSubscriptionPlansLambdas } from './Lambdas/ServiceSubscriptionPlans';

import { LambdaIntegrations } from './Helper/GWtypes';
import { CreateUserSubscriptionPlansBotsLambdas } from './Lambdas/UserSubscriptionPlansBot';
import { CreateUserSubscriptionPlansChannelsLambdas } from './Lambdas/UserSubscriptionPlansChannel';
import { CreateCleanupProcessor } from './Lambdas/CleanUpProcessor';
import { CreateMasterManagerLambdas } from './Lambdas/MasterManager';
export class SubscriptionsRestServicesStack extends Stack {
    lambdaIntegrations: LambdaIntegrations[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        this.lambdaIntegrations = [];

        const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
            tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
            globalIndexes: botsIndexes
        });
        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const serviceSubscriptionPlansLambdas = CreateServiceSubscriptionPlansLambdas(this, layers, [botsTable]);
        this.lambdaIntegrations.push({
            rootResource: 'ServiceSubscriptionPlans',
            lambdas: serviceSubscriptionPlansLambdas
        });

        const userSubscriptionPlansBotsLambdas = CreateUserSubscriptionPlansBotsLambdas(this, layers, [botsTable]);
        this.lambdaIntegrations.push({
            rootResource: 'UserSubscriptionPlansBot',
            lambdas: userSubscriptionPlansBotsLambdas
        });

        const userSubscriptionPlansChannelsLambdas = CreateUserSubscriptionPlansChannelsLambdas(this, layers, [botsTable]);
        this.lambdaIntegrations.push({
            rootResource: 'UserSubscriptionPlansChannel',
            lambdas: userSubscriptionPlansChannelsLambdas
        });

        const masterManagerLambdas = CreateMasterManagerLambdas(this, layers, [botsTable]);
        this.lambdaIntegrations.push({
            rootResource: 'MasterManager',
            lambdas: masterManagerLambdas
        });
    }
}
