import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { CreateHelpCenterLambdas } from './Lambdas/HelpCenterLambdas';
import { CreatePublicPagesLambdas } from './Lambdas/PublicPages';
import { CreateGetBotLandingLambda } from './Lambdas/BotLandingPublic';
import { ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
//@ts-ignore
import { CreateAPIwithOutAuth } from '/opt/DevHelpers/CreateAPIwithOutAuth';

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

        const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
            tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
            globalIndexes: botsIndexes
        });
        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const webPublicPagesAPI = CreateAPIwithOutAuth(this, props.enableAPICache, props.certificateARN, StaticEnvironment.WebResources.subDomains.apiBackend.pagesDataSubDomain);

        CreateHelpCenterLambdas(this, webPublicPagesAPI.root.addResource('help-center'), props.enableAPICache, layers, [webTable]);

        CreatePublicPagesLambdas(this, webPublicPagesAPI.root.addResource('content'), props.enableAPICache, layers, [webTable]);

        CreateGetBotLandingLambda(this, webPublicPagesAPI.root.addResource('bot-landing'), props.enableAPICache, layers, [botsTable]);
    }
}
