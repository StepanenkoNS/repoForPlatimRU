import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateCRMLambdas } from './CRMLambdas/CRM';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class CRMRestServicesStack extends Stack {
    lambdaIntegrations: LambdaIntegrations[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layerARNs: string[];
            lambdaRole: IRole;
        }
    ) {
        super(scope, id, props);
        this.lambdaIntegrations = [];

        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const crmLambdas = CreateCRMLambdas(this, layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'CRM',
            lambdas: crmLambdas
        });
    }
}
