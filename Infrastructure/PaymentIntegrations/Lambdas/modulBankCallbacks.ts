import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';

import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

export function modulBankCallbacksLambdas(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    const ModulPaymentCallBackLambda = new NodejsFunction(that, 'ModulPaymentCallBack', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentProcessor', 'ModulPaymentCallBack.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-ModulPayment-callback',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SMALL,
        role: lambdaRole,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,

            modulMerchantId: StaticEnvironment.PaymentGateways.modulBank.MerchantId,
            modulSuccess_url: StaticEnvironment.PaymentGateways.modulBank.success_url,
            modulCallback_url: StaticEnvironment.PaymentGateways.modulBank.callback_url,
            modulKey: StaticEnvironment.PaymentGateways.modulBank.TestKey
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
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
