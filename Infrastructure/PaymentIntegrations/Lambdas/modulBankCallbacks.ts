import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { StaticEnvironment } from '../../../../../Core/ReadmeAndConfig/StaticEnvironment';

import { IRole } from 'aws-cdk-lib/aws-iam';

import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

export function modulBankCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaBasicRole: IRole) {
    const ModulPaymentCallBackLambda = new NodejsFunction(that, 'ModulPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Modul', 'ModulPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-ModulPayment-callback',
        runtime: StaticEnvironment(props.environment).LambdaSettings.runtime,
        logRetention: StaticEnvironment(props.environment).LambdaSettings.logRetention,
        timeout: StaticEnvironment(props.environment).LambdaSettings.timeout.SMALL,
        role: lambdaBasicRole,
        environment: {
            ...StaticEnvironment(props.environment).LambdaSettings.EnvironmentVariables,

            modulMerchantId: StaticEnvironment(props.environment).PaymentGateways.modulBank.MerchantId,
            modulSuccess_url: StaticEnvironment(props.environment).PaymentGateways.modulBank.success_url,
            modulCallback_url: StaticEnvironment(props.environment).PaymentGateways.modulBank.callback_url,
            modulKey: StaticEnvironment(props.environment).PaymentGateways.modulBank.TestKey
        },
        bundling: {
            externalModules: StaticEnvironment(props.environment).LambdaSettings.externalModules
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
