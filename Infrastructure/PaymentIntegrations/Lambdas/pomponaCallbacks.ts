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

    const PomponaModulPaymentCallBackLambda = new NodejsFunction(that, 'PomponaModulPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CallBack_pompona', 'Modul', 'ModulPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-Modul-Pompona-callback',
        runtime: StaticEnvironment(environment).LambdaSettings.runtime,
        logRetention: StaticEnvironment(environment).LambdaSettings.logRetention,
        timeout: StaticEnvironment(environment).LambdaSettings.timeout.SMALL,
        role: lambdaBasicRole,
        environment: {
            ...StaticEnvironment(environment).LambdaSettings.EnvironmentVariables,

            pomponaModulShopId: StaticEnvironment(environment).PomponaPaymentGateways.modulBank.shopId,
            pomponaModulSuccess_url: StaticEnvironment(environment).PomponaPaymentGateways.modulBank.success_url,
            pomponaModulCallback_url: StaticEnvironment(environment).PomponaPaymentGateways.modulBank.callback_url,
            pomponaModulKey: StaticEnvironment(environment).PomponaPaymentGateways.modulBank.key,
            paymentProcessorConfirmationRequestQueueURL: PaymentProcessorConfirmation.queueUrl
        },
        bundling: {
            externalModules: StaticEnvironment(environment).LambdaSettings.externalModules
        },
        layers: layers
    });

    returnArray.push({
        lambda: PomponaModulPaymentCallBackLambda,
        resource: 'modul',
        httpMethod: 'POST'
    });

    return returnArray;
}
