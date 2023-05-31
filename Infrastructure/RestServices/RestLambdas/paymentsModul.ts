import { CfnOutput, Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime, StartingPosition } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import * as DynamicEnvironment from '../../../../ReadmeAndConfig/DynamicEnvironment';
import { GrantAccessToDDB, LambdaAndResource } from '/opt/DevHelpers/AccessHelper';

import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export function PaymentsModul(that: any, layers: ILayerVersion[], tables: ITable[]) {
    const ModulPaymentGenerateDataLambda = new NodejsFunction(that, 'ModulPaymentGenerateData', {
        entry: join(__dirname, '..', '..', '..', 'services', 'PaymentProcessor', 'ModulPaymentGenerateData.ts'),
        handler: 'handler',
        functionName: 'paymentProcessor-ModulPayment-generate',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SMALL,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables,
            modulSalt: StaticEnvironment.Secrets.modulSalt,
            modulTestKey: StaticEnvironment.Secrets.modulTestKey,
            modulProductionKey: StaticEnvironment.Secrets.modulProductionKey
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    GrantAccessToDDB([ModulPaymentGenerateDataLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ModulPaymentGenerateDataLambda,
        resource: 'GeneratePayment',
        httpMethod: 'POST'
    });

    return returnArray;
}
