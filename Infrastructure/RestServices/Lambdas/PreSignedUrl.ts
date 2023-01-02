import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import * as StaticEnvironment from '../../../../ReadmeAndConfig/StaticEnvironment';
import { GrantAccessToDDB } from '../Helper';

export function CreateGetPresignedUrlsLambdas(that: any, rootResource: apigateway.Resource, layers: ILayerVersion[], tables: ITable[]) {
    //добавление ресурсов в шлюз

    const lambdaGetPresignedUrlsResource = rootResource;

    //Вывод одного элемента
    const GetPresignedUrlLambda = new NodejsFunction(that, 'GetGetPresignedUrlLambda', {
        entry: join(__dirname, '..', '..', '..', 'services', 'Files', 'GetPreSignedUrlLambda.ts'),
        handler: 'GetPreSignedUrlHandler',
        functionName: 'react-GetPresignedUrl-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
            cookieDomain: StaticEnvironment.WebResources.mainDomainName,
            tempUploadsBucketName: StaticEnvironment.S3.buckets.tempUploadsBucketName,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    const lambdaIntegrationGetGetPresignedUrls = new apigateway.LambdaIntegration(GetPresignedUrlLambda);
    lambdaGetPresignedUrlsResource.addMethod('PUT', lambdaIntegrationGetGetPresignedUrls);

    GrantAccessToDDB([GetPresignedUrlLambda], tables);
}
