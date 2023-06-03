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
import { IRole } from 'aws-cdk-lib/aws-iam';

export class WebPublicPagesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            certificateARN: string;

            enableAPICache: boolean;
            layers: ILayerVersion[];
            lambdaRole: IRole;
        }
    ) {
        super(scope, id, props);
        const webTable = Table.fromTableName(this, 'imported-webTable', StaticEnvironment.DynamoDbTables.webTable.name);

        const webPublicPagesAPI = CreateAPIwithOutAuth(this, props.enableAPICache, props.certificateARN, StaticEnvironment.WebResources.subDomains.apiBackend.pagesDataSubDomain);

        CreateHelpCenterLambdas(this, webPublicPagesAPI.root.addResource('help-center'), props.enableAPICache, props.layers, props.lambdaRole);

        CreatePublicPagesLambdas(this, webPublicPagesAPI.root.addResource('content'), props.enableAPICache, props.layers, props.lambdaRole);

        CreateGetBotLandingLambda(this, webPublicPagesAPI.root.addResource('bot-landing'), props.enableAPICache, props.layers, props.lambdaRole);
    }
}
