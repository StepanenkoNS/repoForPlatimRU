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

import { CreateBotsLambdas } from './Lambdas/Bots';

import { CreateCurrencySettingsLambdas } from './Lambdas/CurrencySettings';
import { CreatePaymentOptionsLambdas } from './Lambdas/PaymentOptions';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { LambdaIntegrations } from './Helper/GWtypes';
import { CreateChannelsLambdas } from './Lambdas/Channels';

export class MainRestServicesStack extends Stack {
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

        const botLambdas = CreateBotsLambdas(this, layers, [botsTable]);

        this.lambdaIntegrations.push({
            rootResource: 'Bots',
            lambdas: botLambdas
        });

        const channelLambdas = CreateChannelsLambdas(this, layers, [botsTable]);

        this.lambdaIntegrations.push({
            rootResource: 'Channels',
            lambdas: channelLambdas
        });

        const currencyLambdas = CreateCurrencySettingsLambdas(this, layers, [botsTable]);

        this.lambdaIntegrations.push({
            rootResource: 'DefaultCurrency',
            lambdas: currencyLambdas
        });

        const paymentOptionsLambdas = CreatePaymentOptionsLambdas(this, layers, [botsTable]);

        this.lambdaIntegrations.push({
            rootResource: 'PaymentOptions',
            lambdas: paymentOptionsLambdas
        });
    }
}
