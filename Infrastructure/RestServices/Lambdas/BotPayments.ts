import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';

//@ts-ignore
import { GrantAccessToDDB, GrantAccessToS3 } from '/opt/DevHelpers/AccessHelper';

import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateBotPaymentsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //Вывод списка
    const ListBotPaymentsLambda = new NodejsFunction(that, 'ListBotPaymentsLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'BotPayments', 'ListBotPaymentsLambda.ts'),
        handler: 'handler',
        functionName: 'react-BotPayments-List-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });

    GrantAccessToDDB([ListBotPaymentsLambda], tables);

    GrantAccessToS3([ListBotPaymentsLambda], [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: ListBotPaymentsLambda,
        resource: 'List',
        httpMethod: 'GET'
    });

    return returnArray;
}
