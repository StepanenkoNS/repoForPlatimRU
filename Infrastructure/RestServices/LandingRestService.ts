import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { ReturnGSIs } from '/opt/LambdaHelpers/AccessHelper';

import { RestApi } from 'aws-cdk-lib/aws-apigateway';

import { CreateBotSetLandingLambdas } from './Lambdas/Landing';
// import { CreatePaymentOptionsLambdas } from './Lambdas/PaymentOptions';
// import { CreateBotsLambdas } from './Lambdas/Bots';
// import { CreateSubscriptionPlansLambdas } from './Lambdas/SubscriptionPlans';
// import { CreateCurrencySettingsLambdas } from './Lambdas/CurrencySettings';
// import { CreateContentPlansLambdas } from './Lambdas/ContentPlans';
// import { CreateContentPlanPostsLambdas } from './Lambdas/ContentPlanPosts';
// import { CreateMessageFilesLambdas } from './Lambdas/MessageFiles';
// import { CreateGetPresignedUrlsLambdas } from './Lambdas/PreSignedUrl';

// import { CreateSendMessagesLambdas } from './Lambdas/SendMessages';

export class BotLandingRestServicesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            restServicesAPI: RestApi;
            certificateARN: string;
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        // const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);

        const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
            tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
            globalIndexes: botsIndexes
        });
        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        CreateBotSetLandingLambdas(this, props.restServicesAPI.root.addResource('Landing'), layers, [botsTable]);
    }
}
