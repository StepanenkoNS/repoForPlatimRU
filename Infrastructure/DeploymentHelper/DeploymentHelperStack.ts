import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateCRMLambdas } from './CRMLambdas/CRM';
import { IRole, Role } from 'aws-cdk-lib/aws-iam';

export class DeploymentHelper extends Stack {
    lambdaRole: IRole;
    layers: ILayerVersion[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {}
    ) {
        super(scope, id, props);

        const lambdaRole = Role.fromRoleArn(this, 'lambdaRole-imported', DynamicEnvironment.IAMroles.lambdaRole);
        this.lambdaRole = lambdaRole;
        const layers: ILayerVersion[] = [];
        for (const layerARN of [DynamicEnvironment.Layers.ModelsLayerARN, DynamicEnvironment.Layers.UtilsLayerARN, DynamicEnvironment.Layers.TypesLayer, DynamicEnvironment.Layers.I18NLayerARN]) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        this.layers = layers;
    }
}
