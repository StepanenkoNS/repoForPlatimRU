import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvrionment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

//@ts-ignore
import { ReturnGSIs } from '/opt/LambdaHelpers/AccessHelper';
//@ts-ignore

import { CreateSendMessagesLambdas } from './Lambdas/SendTestMessages';
import { SendMessageScheduler } from './Lambdas/SendMessageScheduler';
import { PaymentProcessor } from './Lambdas/PaymentProcessor';

import { LambdaIntegrations } from './Helper/GWtypes';
import { CreateBotPaymentsLambdas } from './Lambdas/BotPayments';
import { CreateSubscriptionProcessor } from './Lambdas/SubscriptionProcessor';

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

        SendMessageScheduler(this, layers, [botsTable]);

        PaymentProcessor(this, layers, [botsTable]);

        CreateSubscriptionProcessor(this, layers, [botsTable]);
    }
}
