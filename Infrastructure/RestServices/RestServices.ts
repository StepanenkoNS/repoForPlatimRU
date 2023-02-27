import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { createAPIandAuthorizer, GrantAccessToDDB, GrantAccessToSecrets, ReturnGSIs } from './Helper';
import { CreatePaymentOptionsLambdas } from './Lambdas/PaymentOptions';
import { CreateBotsLambdas } from './Lambdas/Bots';
import { CreateSubscriptionPlansLambdas } from './Lambdas/SubscriptionPlans';
import { CreateCurrencySettingsLambdas } from './Lambdas/CurrencySettings';
import { CreateContentPlansLambdas } from './Lambdas/ContentPlans';
import { CreateContentPlanPostsLambdas } from './Lambdas/ContentPlanPosts';
import { CreateMessageFilesLambdas } from './Lambdas/MessageFiles';
import { CreateGetPresignedUrlsLambdas } from './Lambdas/PreSignedUrl';
import { CreateSubscriptionSettingsLambdas } from './Lambdas/SubscriptionSettings';

export class RestServicesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
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

        const restServicesAPI = createAPIandAuthorizer(this, props.certificateARN, layers, [botsTable]);

        CreateBotsLambdas(this, restServicesAPI.root.addResource('Bots'), layers, [botsTable]);
        CreateCurrencySettingsLambdas(this, restServicesAPI.root.addResource('DefaultCurrency'), layers, [botsTable]);

        CreateSubscriptionSettingsLambdas(this, restServicesAPI.root.addResource('ActiveSubscription'), layers, [botsTable]);

        CreatePaymentOptionsLambdas(this, restServicesAPI.root.addResource('PaymentOptions'), layers, [botsTable]);
        CreateSubscriptionPlansLambdas(this, restServicesAPI.root.addResource('SubscriptionPlans'), layers, [botsTable]);
        CreateContentPlansLambdas(this, restServicesAPI.root.addResource('ContentPlans'), layers, [botsTable]);
        CreateContentPlanPostsLambdas(this, restServicesAPI.root.addResource('ContentPlanPosts'), layers, [botsTable]);

        CreateMessageFilesLambdas(this, restServicesAPI.root.addResource('MessageFiles'), layers, [botsTable]);

        CreateGetPresignedUrlsLambdas(this, restServicesAPI.root.addResource('PreSignedUrls'), layers, [botsTable]);

        new CfnOutput(this, this.stackName + '-APIGW-SecureAPI', {
            value: restServicesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-SecureAPI'
        });
    }
}
