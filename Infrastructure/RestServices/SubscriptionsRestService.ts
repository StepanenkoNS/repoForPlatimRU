import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { LambdaIntegrations } from '../Helper/GWtypes';
import { CreateUserSubscriptionPlansBotsLambdas } from './RestLambdas/UserSubscriptionPlansBot';
import { CreateUserSubscriptionPlansChannelsLambdas } from './RestLambdas/UserSubscriptionPlansChannel';

import { CreateMasterManagerLambdas } from './RestLambdas/MasterManager';
import { IRole } from 'aws-cdk-lib/aws-iam';
export class SubscriptionsRestServicesStack extends Stack {
    lambdaIntegrations: LambdaIntegrations[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layers: ILayerVersion[];
            lambdaRole: IRole;
        }
    ) {
        super(scope, id, props);
        this.lambdaIntegrations = [];

        const userSubscriptionPlansBotsLambdas = CreateUserSubscriptionPlansBotsLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'UserSubscriptionPlansBot',
            lambdas: userSubscriptionPlansBotsLambdas
        });

        const userSubscriptionPlansChannelsLambdas = CreateUserSubscriptionPlansChannelsLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'UserSubscriptionPlansChannel',
            lambdas: userSubscriptionPlansChannelsLambdas
        });

        const masterManagerLambdas = CreateMasterManagerLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'MasterManager',
            lambdas: masterManagerLambdas
        });
    }
}
