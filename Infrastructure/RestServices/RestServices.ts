import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { createAPIandAuthorizer, GrantAccessToDDB, GrantAccessToSecrets } from './Helper';
import { CreatePaymentOptionsLambdas } from './Lambdas/PaymentOptions';
import { CreateBotsLambdas } from './Lambdas/Bots';
import { CreateSubscriptionOptionsLambdas } from './Lambdas/SubscriptionOptions';
import { CreateCurrencySettingsLambdas } from './Lambdas/CurrencySettings';

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
        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);
        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const restServicesAPI = createAPIandAuthorizer(this, props.certificateARN, layers, [botsTable]);

        CreateBotsLambdas(this, restServicesAPI.root.addResource('Bots'), layers, [botsTable]);
        CreateCurrencySettingsLambdas(this, restServicesAPI.root.addResource('DefaultCurrency'), layers, [botsTable]);
        CreatePaymentOptionsLambdas(this, restServicesAPI.root.addResource('PaymentOptions'), layers, [botsTable]);
        CreateSubscriptionOptionsLambdas(this, restServicesAPI.root.addResource('SubscriptionOptions'), layers, [botsTable]);

        new CfnOutput(this, this.stackName + '-APIGW-SecureAPI', {
            value: restServicesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-SecureAPI'
        });
    }
}
