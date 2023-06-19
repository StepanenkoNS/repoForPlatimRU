import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';

//@ts-ignore
import * as DynamicEnvironment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { IRole, Role } from 'aws-cdk-lib/aws-iam';

export class DeploymentHelper extends Stack {
    lambdaRole: IRole;
    lambdaPublicPagesRole: IRole;
    layers: ILayerVersion[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {}
    ) {
        super(scope, id, props);

        const lambdaRole = Role.fromRoleArn(this, 'lambdaRole-imported', DynamicEnvironment.IAMroles.lambdaRole);
        this.lambdaRole = lambdaRole;

        const lambdaPublicPagesRole = Role.fromRoleArn(this, 'lambdaPublicPagesRole-imported', DynamicEnvironment.IAMroles.lambdaPublicPagesRole);
        this.lambdaPublicPagesRole = lambdaPublicPagesRole;

        const layers: ILayerVersion[] = [];
        for (const layerARN of [
            DynamicEnvironment.Layers.ModelsLayerARN,
            DynamicEnvironment.Layers.UtilsLayerARN
            //    DynamicEnvironment.Layers.I18NLayerARN
        ]) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        this.layers = layers;
    }
}
