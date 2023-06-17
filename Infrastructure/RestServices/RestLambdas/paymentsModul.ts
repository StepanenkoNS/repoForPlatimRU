import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../Core/ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../Core/ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

import { Effect, IRole, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function PaymentsModul(that: any, layers: ILayerVersion[], lambdaRole: IRole) {
    const ModulPaymentGenerateDataLambda = new NodejsFunction(that, 'ModulPaymentGenerateData', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentProcessor', 'ModulPaymentGenerateData.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-ModulPayment-generate',
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

    //GrantAccessToDDB([ModulPaymentGenerateDataLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ModulPaymentGenerateDataLambda,
        resource: 'GeneratePayment',
        httpMethod: 'POST'
    });

    return returnArray;
}
