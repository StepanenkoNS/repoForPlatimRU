import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { StaticEnvironment } from '../../../../../Core/ReadmeAndConfig/StaticEnvironment';

import { IRole } from 'aws-cdk-lib/aws-iam';
import { EEnvironment } from '/opt/DevHelpers/AWSEnvConfig';

import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

export function modulBankCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaBasicRole: IRole, environment: EEnvironment) {
    const ModulPaymentCallBackLambda = new NodejsFunction(that, 'ModulPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Modul', 'ModulPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-ModulPayment-callback',
        runtime: StaticEnvironment(environment).LambdaSettings.runtime,
        logRetention: StaticEnvironment(environment).LambdaSettings.logRetention,
        timeout: StaticEnvironment(environment).LambdaSettings.timeout.SMALL,
        role: lambdaBasicRole,
        environment: {
            ...StaticEnvironment(environment).LambdaSettings.EnvironmentVariables,

            modulMerchantId: StaticEnvironment(environment).PaymentGateways.modulBank.MerchantId,
            modulSuccess_url: StaticEnvironment(environment).PaymentGateways.modulBank.success_url,
            modulCallback_url: StaticEnvironment(environment).PaymentGateways.modulBank.callback_url,
            modulKey: StaticEnvironment(environment).PaymentGateways.modulBank.key
        },
        bundling: {
            externalModules: StaticEnvironment(environment).LambdaSettings.externalModules
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
