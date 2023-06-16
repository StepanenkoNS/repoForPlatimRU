import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';

import { LambdaIntegrations, ReturnGSIs } from 'opt/DevHelpers/AccessHelper';
import * as DynamicEnvrionment from '../../../Core/ReadmeAndConfig/DynamicEnvironment';
//@ts-ignore
import { CreateAPIwithOutAuth } from 'opt/DevHelpers/CreateAPIwithOutAuth';
import { modulBankCallbacksLambdas } from './Lambdas/modulBankCallbacks';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class PaymentIntegrationsStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            layers: ILayerVersion[];
            lambdaRole: IRole;
            certificateARN: string;
            enableAPICache: boolean;
        }
    ) {
        super(scope, id, props);

        const lambdaIntegrations: LambdaIntegrations[] = [];

        // const botsIndexes = ReturnGSIs(StaticEnvironment.DynamoDbTables.botsTable.GSICount);
        // const botsTable = Table.fromTableAttributes(this, 'imported-BotsTable', {
        //     tableArn: DynamicEnvrionment.DynamoDbTables.botsTable.arn,
        //     globalIndexes: botsIndexes
        // });
        // const layers: ILayerVersion[] = [];
        // for (const layerARN of props.layerARNs) {
        //     layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        // }

        const paymentsApi = CreateAPIwithOutAuth(this, props.enableAPICache, props.certificateARN, StaticEnvironment.WebResources.subDomains.apiBackend.paymentIntegrations);

        const modulLambdas = modulBankCallbacksLambdas(this, props.layers, props.lambdaRole);
        lambdaIntegrations.push({
            rootResource: 'modul_ru',
            lambdas: modulLambdas
        });

        let resource: apigateway.Resource | undefined = undefined;
        for (const item of lambdaIntegrations) {
            resource = paymentsApi.root.addResource(item.rootResource);

            for (const lambda of item.lambdas) {
                let res = resource;
                if (lambda.resource) {
                    res = res.addResource(lambda.resource);
                }
                const lambdaIntegration = new apigateway.LambdaIntegration(lambda.lambda, {
                    allowTestInvoke: false
                });
                res.addMethod(lambda.httpMethod, lambdaIntegration);
            }
        }
    }
}
