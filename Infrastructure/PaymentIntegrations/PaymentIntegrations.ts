import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
//@ts-ignore
import { StackPropsWithCertificate, StackPropsWithConfigAndLayers } from '/opt/DevHelpers/AWSEnvConfig';

import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { ILayerVersion, LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { StaticEnvironment } from '../../../../Core/ReadmeAndConfig/StaticEnvironment';

//@ts-ignore
import { LambdaIntegrations } from '/opt/DevHelpers/AccessHelper';
import { DynamicEnvironment } from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
//@ts-ignore
import { CreateAPIwithOutAuth } from '/opt/DevHelpers/CreateAPIwithOutAuth';
import { modulBankCallbacksLambdas } from './Lambdas/modulBankCallbacks';
import { Role } from 'aws-cdk-lib/aws-iam';
import { GetClientPaymentDetailsLambdas } from './Lambdas/clientPaymentDetails';
import { yoomoneyCallbacksLambdas } from './Lambdas/yoomoneyCallbacks';
import { robokassaCallbacksLambdas } from './Lambdas/robokassaCallbacks';

export class PaymentIntegrationsStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackPropsWithConfigAndLayers &
            StackPropsWithCertificate & {
                enableAPICache: boolean;
            }
    ) {
        super(scope, id, props);

        const lambdaBasicRole = Role.fromRoleArn(this, 'lambdaBasicRole-imported', DynamicEnvironment(props.environment).IAMroles.lambdaBasicRole, {
            mutable: false
        });

        const layers: ILayerVersion[] = [
            LayerVersion.fromLayerVersionArn(this, `importedLayer-${this.stackName}-Models`, props.LayerArns.LayersModel),
            LayerVersion.fromLayerVersionArn(this, `importedLayer-${this.stackName}-Utils`, props.LayerArns.LayersUtils),
            LayerVersion.fromLayerVersionArn(this, `importedLayer-${this.stackName}-i18N`, props.LayerArns.LayersI18N)
        ];

        const lambdaIntegrations: LambdaIntegrations[] = [];

        const paymentsApi = CreateAPIwithOutAuth(
            this,
            props.enableAPICache,
            props.certificateARN,
            StaticEnvironment(props.environment).WebResources.subDomains.apiBackend.paymentIntegrations,
            props.environment
        );

        const modulLambdas = modulBankCallbacksLambdas(this, layers, lambdaBasicRole, props.environment);
        lambdaIntegrations.push({
            rootResource: 'modulRu',
            lambdas: modulLambdas
        });

        const yoomoneyLambdas = yoomoneyCallbacksLambdas(this, layers, lambdaBasicRole, props.environment);
        lambdaIntegrations.push({
            rootResource: 'yoomoneyRU',
            lambdas: yoomoneyLambdas
        });

        const robokassaLambdas = robokassaCallbacksLambdas(this, layers, lambdaBasicRole, props.environment);
        lambdaIntegrations.push({
            rootResource: 'robokassaRU',
            lambdas: robokassaLambdas
        });

        const getClientPaymentDetailsLambdas = GetClientPaymentDetailsLambdas(this, layers, lambdaBasicRole, props.environment);
        lambdaIntegrations.push({
            rootResource: 'clientPaymentDetails',
            lambdas: getClientPaymentDetailsLambdas
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
