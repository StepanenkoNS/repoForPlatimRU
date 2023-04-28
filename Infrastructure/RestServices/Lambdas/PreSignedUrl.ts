import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import { GrantAccessToDDB, GrantAccessToS3 } from '/opt/DevHelpers/AccessHelper';
import { LambdaAndResource } from '../Helper/GWtypes';

export function CreateGetPresignedUrlsLambdas(that: any, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    //Вывод одного элемента
    const GetPresignedUrlLambda = new NodejsFunction(that, 'GetGetPresignedUrlLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Files', 'GetPreSignedUrlLambda.ts'),
        handler: 'handler',
        functionName: 'react-GetPresignedUrl-Lambda',
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

    GrantAccessToS3([GetPresignedUrlLambda], [StaticEnvironment.S3.buckets.botsBucketName, StaticEnvironment.S3.buckets.tempUploadsBucketName]);

    GrantAccessToDDB([GetPresignedUrlLambda], tables);

    const returnArray: LambdaAndResource[] = [];
    returnArray.push({
        lambda: GetPresignedUrlLambda,
        resource: undefined,
        httpMethod: 'PUT'
    });
    return returnArray;
}
