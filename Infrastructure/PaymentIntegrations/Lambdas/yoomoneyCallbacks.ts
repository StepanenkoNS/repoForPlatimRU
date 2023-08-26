import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { StaticEnvironment } from '../../../../../Core/ReadmeAndConfig/StaticEnvironment';

import { IRole } from 'aws-cdk-lib/aws-iam';
import { EEnvironment } from 'tgbot-project-types/TypesCompiled/generalTypes';

import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamicEnvironment } from '../../../../../Core/ReadmeAndConfig/DynamicEnvironment';

export function yoomoneyCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaBasicRole: IRole, environment: EEnvironment) {
    const PaymentProcessorConfirmation = Queue.fromQueueArn(that, 'imported-PaymentProcessorConfirmation-yooumoney', DynamicEnvironment(environment).sqs.PaymentProcessor_Confirmation.basic_arn);

    const ModulPaymentCallBackLambda = new NodejsFunction(that, 'YoomoneyPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Yoomoney', 'YoomoneyPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-YoomoneyPayment-callback',
        runtime: StaticEnvironment(environment).LambdaSettings.runtime,
        logRetention: StaticEnvironment(environment).LambdaSettings.logRetention,
        timeout: StaticEnvironment(environment).LambdaSettings.timeout.SMALL,
        role: lambdaBasicRole,
        environment: {
            ...StaticEnvironment(environment).LambdaSettings.EnvironmentVariables,
            paymentProcessorConfirmationRequestQueueURL: PaymentProcessorConfirmation.queueUrl
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
