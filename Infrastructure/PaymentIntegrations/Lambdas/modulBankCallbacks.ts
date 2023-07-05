import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../../Core/ReadmeAndConfig/StaticEnvironment';

import { IRole } from 'aws-cdk-lib/aws-iam';

import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

export function modulBankCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    const ModulPaymentCallBackLambda = new NodejsFunction(that, 'ModulPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Modul', 'ModulPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-ModulPayment-callback',
        runtime: StaticEnvironment.LambdaSettings.runtime,
        logRetention: StaticEnvironment.LambdaSettings.logRetention,
        timeout: StaticEnvironment.LambdaSettings.timeout.SMALL,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettings.EnvironmentVariables,

            modulMerchantId: StaticEnvironment.PaymentGateways.modulBank.MerchantId,
            modulSuccess_url: StaticEnvironment.PaymentGateways.modulBank.success_url,
            modulCallback_url: StaticEnvironment.PaymentGateways.modulBank.callback_url,
            modulKey: StaticEnvironment.PaymentGateways.modulBank.TestKey
        },
        bundling: {
            externalModules: StaticEnvironment.LambdaSettings.externalModules
        },
        layers: layers
    });

    const returnArray: LambdaAndResource[] = [];

    returnArray.push({
        lambda: ModulPaymentCallBackLambda,
        resource: 'callback',
        httpMethod: 'POST'
    });

    return returnArray;
}
