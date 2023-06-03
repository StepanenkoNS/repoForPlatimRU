import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';

import { CreateBotSetLandingLambdas } from './RestLambdas/Landing';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class BotLandingRestServicesStack extends Stack {
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

        // const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        // const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
        //     tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
        //     globalIndexes: botsIndexes
        // });
        // const layers: ILayerVersion[] = [];
        // for (const layerARN of props.layerARNs) {
        //     layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        // }

        const landingLambdas = CreateBotSetLandingLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'Landing',
            lambdas: landingLambdas
        });
    }
}
