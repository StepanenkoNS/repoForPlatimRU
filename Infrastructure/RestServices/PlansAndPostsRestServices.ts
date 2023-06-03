import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateContentPlanPostsLambdas } from './RestLambdas/ContentPlanPosts';
import { CreateContentPlansLambdas } from './RestLambdas/ContentPlans';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class PlansAndPostsRestServicesStack extends Stack {
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
        // const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);

        const contenPlanPostsLamdas = CreateContentPlanPostsLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'ContentPlanPosts',
            lambdas: contenPlanPostsLamdas
        });
        const contenPlansLamdas = CreateContentPlansLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'ContentPlans',
            lambdas: contenPlansLamdas
        });
    }
}
