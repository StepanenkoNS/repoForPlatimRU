import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { LambdaIntegrations, ReturnGSIs } from '/opt/DevHelpers/AccessHelper';
//@ts-ignore

import { CreateSendMessagesLambdas } from './RestLambdas/SendTestMessages';
import { SendMessageScheduler } from './RestLambdas/SendMessageScheduler';
import { PaymentProcessor } from './RestLambdas/PaymentProcessor';

import { CreateSubscriptionProcessor } from './RestLambdas/SubscriptionProcessor';
import { CreateDigitalStoreCategories } from './RestLambdas/DigitalStoreCategories';
import { CreateDigitalStoreItems } from './RestLambdas/DigitalStoreItems';
import { PaymentsModul } from './RestLambdas/paymentsModul';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class MessagesAndPaymentsRestServicesStack extends Stack {
    lambdaIntegrations: LambdaIntegrations[];
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layers: ILayerVersion[];
            lambdaRole: IRole;
        }
    ) {
        super(scope, id, props);
        this.lambdaIntegrations = [];
        // const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);

        const sendMessagesLambas = CreateSendMessagesLambdas(this, props.layers, props.lambdaRole);

        this.lambdaIntegrations.push({
            rootResource: 'SendTestMessage',
            lambdas: sendMessagesLambas
        });

        const digitalStoreCategoryLambda = CreateDigitalStoreCategories(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'DigitalStoreCategories',
            lambdas: digitalStoreCategoryLambda
        });

        const digitalStoreItemsLambdas = CreateDigitalStoreItems(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'DigitalStoreItems',
            lambdas: digitalStoreItemsLambdas
        });

        SendMessageScheduler(this, props.layers, props.lambdaRole);

        PaymentProcessor(this, props.layers, props.lambdaRole);

        CreateSubscriptionProcessor(this, props.layers, props.lambdaRole);

        const modulLambdas = PaymentsModul(this, props.layers, props.lambdaRole);
        this.lambdaIntegrations.push({
            rootResource: 'modul_ru',
            lambdas: modulLambdas
        });
    }
}
