import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { StaticEnvironment } from '../../../../../Core/ReadmeAndConfig/StaticEnvironment';

import { IRole } from 'aws-cdk-lib/aws-iam';
import { EEnvironment } from 'tgbot-project-types/TypesCompiled/generalTypes';

import { LambdaAndResource } from '/opt/DevHelpers/AccessHelper';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamicEnvironment } from '../../../../../Core/ReadmeAndConfig/DynamicEnvironment';

export function BasicPaymentCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaBasicRole: IRole, environment: EEnvironment) {
    const returnArray: LambdaAndResource[] = [];

    const PaymentProcessorConfirmation = Queue.fromQueueArn(that, 'imported-PaymentProcessorConfirmation-basic', DynamicEnvironment(environment).sqs.PaymentProcessor_Confirmation.basic_arn);

    const RobokassaPaymentCallBackLambda = new NodejsFunction(that, 'RobokassaPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CallBack_basic', 'Robokassa', 'RobokassaPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-RobokassaPayment-callback',
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

    const YoomoneyPaymentCallBackLambda = new NodejsFunction(that, 'YoomoneyPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CallBack_basic', 'Yoomoney', 'YoomoneyPaymentCallBack.ts'),
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

    const CryptoCloudPaymentCallBackLambda = new NodejsFunction(that, 'CryptoCloudCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CallBack_basic', 'Cryptocloud', 'CryptoCloudCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-CryptoCloud-callback',
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

    const modulCallBackLambda = new NodejsFunction(that, 'ModulPaymentCallBackLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'CallBack_basic', 'Modul', 'ModulPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-Modul-callback',
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

    returnArray.push({
        lambda: RobokassaPaymentCallBackLambda,
        resource: 'robokassa',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: YoomoneyPaymentCallBackLambda,
        resource: 'yoomoney',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: CryptoCloudPaymentCallBackLambda,
        resource: 'cryptocloud',
        httpMethod: 'POST'
    });

    returnArray.push({
        lambda: modulCallBackLambda,
        resource: 'modul',
        httpMethod: 'POST'
    });

    return returnArray;
}
