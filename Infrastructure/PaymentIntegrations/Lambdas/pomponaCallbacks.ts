import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { StaticEnvironment } from '../../../../../Core/ReadmeAndConfig/StaticEnvironment';

import { IRole } from 'aws-cdk-lib/aws-iam';
import { EEnvironment } from 'tgbot-project-types/TypesCompiled/generalTypes';

import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamicEnvironment } from '../../../../../Core/ReadmeAndConfig/DynamicEnvironment';

export function PomponaPaymentCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaBasicRole: IRole, environment: EEnvironment) {
    const returnArray: LambdaAndResource[] = [];

    const PaymentProcessorConfirmation = Queue.fromQueueArn(that, 'imported-PaymentProcessorConfirmation-pompona', DynamicEnvironment(environment).sqs.PaymentProcessor_Confirmation.basic_arn);

    const ModulPaymentCallBackLambda = new NodejsFunction(that, 'ModulPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CallBack_pompona', 'Modul', 'ModulPaymentCallBack.ts'),
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
            modulKey: StaticEnvironment(environment).PaymentGateways.modulBank.key,
            paymentProcessorConfirmationRequestQueueURL: PaymentProcessorConfirmation.queueUrl
        },
        bundling: {
            externalModules: StaticEnvironment(environment).LambdaSettings.externalModules
        },
        layers: layers
    });

    returnArray.push({
        lambda: ModulPaymentCallBackLambda,
        resource: 'modul',
        httpMethod: 'POST'
    });

    return returnArray;
}
