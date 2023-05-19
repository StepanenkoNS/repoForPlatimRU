import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateSendMessagesLambdas } from './RestLambdas/SendTestMessages';
import { SendMessageScheduler } from './RestLambdas/SendMessageScheduler';
import { PaymentProcessor } from './RestLambdas/PaymentProcessor';

import { LambdaIntegrations } from './Helper/GWtypes';
import { CreateBotPaymentsLambdas } from './RestLambdas/BotPayments';
import { CreateSubscriptionProcessor } from './RestLambdas/SubscriptionProcessor';
import { CreateDigitalStoreCategories } from './RestLambdas/DigitalStoreCategories';
import { CreateDigitalStoreItems } from './RestLambdas/DigitalStoreItems';

export class MessagesAndPaymentsRestServicesStack extends Stack {
    lambdaIntegrations: LambdaIntegrations[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        this.lambdaIntegrations = [];
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

        const sendMessagesLambas = CreateSendMessagesLambdas(this, layers, [botsTable]);

        this.lambdaIntegrations.push({
            rootResource: 'SendTestMessage',
            lambdas: sendMessagesLambas
        });

        const BotPaymentsLambas = CreateBotPaymentsLambdas(this, layers, [botsTable]);

        this.lambdaIntegrations.push({
            rootResource: 'BotPayments',
            lambdas: BotPaymentsLambas
        });

        const digitalStoreCategoryLambda = CreateDigitalStoreCategories(this, layers, [botsTable]);
        this.lambdaIntegrations.push({
            rootResource: 'DigitalStoreCategories',
            lambdas: digitalStoreCategoryLambda
        });

        const digitalStoreItemsLambdas = CreateDigitalStoreItems(this, layers, [botsTable]);
        this.lambdaIntegrations.push({
            rootResource: 'DigitalStoreItems',
            lambdas: digitalStoreItemsLambdas
        });

        SendMessageScheduler(this, layers, [botsTable]);

        PaymentProcessor(this, layers, [botsTable]);

        CreateSubscriptionProcessor(this, layers, [botsTable]);
    }
}
