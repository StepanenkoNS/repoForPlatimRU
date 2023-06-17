import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateCRMLambdas } from './CRMLambdas/CRM';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { CreateCampaignsInternalLambdas } from './CRMLambdas/CampaignsInternal';
import { CreateCampaignsUTMLambdas } from './CRMLambdas/CampaignsUTM';

export class CRMCampaignsStack extends Stack {
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

        const campaignsInternalLambdas = CreateCampaignsInternalLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'CampaignsInternal',
            lambdas: campaignsInternalLambdas
        });

        const campaignsUTMlLambdas = CreateCampaignsUTMLambdas(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'CampaignsUTM',
            lambdas: campaignsUTMlLambdas
        });
    }
}
