import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { ReturnGSIs } from '/opt/LambdaHelpers/AccessHelper';
//@ts-ignore
import { createAPIandAuthorizer } from '/opt/LambdaHelpers/CreateAPIwithAuth';
import { CreateMessageFilesLambdas } from './Lambdas/MessageFiles';
import { CreateGetPresignedUrlsLambdas } from './Lambdas/PreSignedUrl';
import { CreateBotsLambdas } from './Lambdas/Bots';
import { CreateContentPlanPostsLambdas } from './Lambdas/ContentPlanPosts';
import { CreateContentPlansLambdas } from './Lambdas/ContentPlans';
import { CreateCurrencySettingsLambdas } from './Lambdas/CurrencySettings';
import { CreatePaymentOptionsLambdas } from './Lambdas/PaymentOptions';
import { CreateSubscriptionSettingsLambdas } from './Lambdas/SubscriptionSettings';
import { CreateSendMessagesLambdas } from './Lambdas/SendTestMessages';
import { SendMessageScheduler } from './Lambdas/SendMessageScheduler';
import { PaymentProcessor } from './Lambdas/PaymentProcessor';
import { CreateServiceSubscriptionPlansLambdas } from './Lambdas/ServiceSubscriptionPlans';
import { CreateUserSubscriptionPlansLambdas } from './Lambdas/UserSubscriptionPlans';
// import { CreatePaymentOptionsLambdas } from './Lambdas/PaymentOptions';
// import { CreateBotsLambdas } from './Lambdas/Bots';
// import { CreateSubscriptionPlansLambdas } from './Lambdas/SubscriptionPlans';
// import { CreateCurrencySettingsLambdas } from './Lambdas/CurrencySettings';
// import { CreateContentPlansLambdas } from './Lambdas/ContentPlans';
// import { CreateContentPlanPostsLambdas } from './Lambdas/ContentPlanPosts';
// import { CreateMessageFilesLambdas } from './Lambdas/MessageFiles';
// import { CreateGetPresignedUrlsLambdas } from './Lambdas/PreSignedUrl';
// import { CreateSubscriptionSettingsLambdas } from './Lambdas/SubscriptionSettings';
// import { CreateSendMessagesLambdas } from './Lambdas/SendMessages';

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

        CreateMessageFilesLambdas(this, restServicesAPI.root.addResource('MessageFiles'), layers, [botsTable]);

        CreateGetPresignedUrlsLambdas(this, restServicesAPI.root.addResource('PreSignedUrls'), layers, [botsTable]);

        CreateBotsLambdas(this, restServicesAPI.root.addResource('Bots'), layers, [botsTable]);

        CreateContentPlanPostsLambdas(this, restServicesAPI.root.addResource('ContentPlanPosts'), layers, [botsTable]);
        CreateContentPlansLambdas(this, restServicesAPI.root.addResource('ContentPlans'), layers, [botsTable]);

        CreateCurrencySettingsLambdas(this, restServicesAPI.root.addResource('DefaultCurrency'), layers, [botsTable]);

        CreatePaymentOptionsLambdas(this, restServicesAPI.root.addResource('PaymentOptions'), layers, [botsTable]);

        CreateSubscriptionSettingsLambdas(this, restServicesAPI.root.addResource('ActiveSubscription'), layers, [botsTable]);

        CreateSendMessagesLambdas(this, restServicesAPI.root.addResource('SendTestMessage'), layers, [botsTable]);

        CreateServiceSubscriptionPlansLambdas(this, restServicesAPI.root.addResource('ServiceSubscriptionPlans'), layers, [botsTable]);

        CreateUserSubscriptionPlansLambdas(this, restServicesAPI.root.addResource('UserSubscriptionPlans'), layers, [botsTable]);

        SendMessageScheduler(this, layers, [botsTable]);

        PaymentProcessor(this, layers, [botsTable]);

        // CreateSubscriptionPlansLambdas(this, restServicesAPI.root.addResource('SubscriptionPlans'), layers, [botsTable]);

        // CreateSendMessagesLambdas(this, restServicesAPI.root.addResource('SendMessages'), layers, [botsTable]);

        new CfnOutput(this, this.stackName + '-APIGW-SecureAPI', {
            value: restServicesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-SecureAPI'
        });
    }
}
