import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { createAPI, GrantAccessToDDB } from './Helper';
import { CreateHelpCenterLambdas } from './Lambdas/HelpCenterLambdas';
import { CreatePublicPagesLambdas } from './Lambdas/PublicPages';

export class WebPublicPagesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            certificateARN: string;
            layerARNs: string[];
            enableAPICache: boolean;
        }
    ) {
        super(scope, id, props);
        const webTable = Table.fromTableName(this, 'imported-webTable', StaticEnvironment.DynamoDbTables.webTable.name);

        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const webPublicPagesAPI = createAPI(this, props.enableAPICache, props.certificateARN);

        CreateHelpCenterLambdas(this, webPublicPagesAPI.root.addResource('help-center'), props.enableAPICache, layers, [webTable]);

        CreatePublicPagesLambdas(this, webPublicPagesAPI.root.addResource('content'), props.enableAPICache, layers, [webTable]);
    }
}
