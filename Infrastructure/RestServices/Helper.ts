import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { ILayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { join } from 'path';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export function createAPIandAuthorizer(that: any, certificateARN: string, layers: ILayerVersion[], tables: ITable[]) {
    const siteDomain = StaticEnvironment.WebResources.mainDomainName;
    const myZone = route53.HostedZone.fromLookup(that, 'Zone', {
        domainName: siteDomain
    });
    const LambdaJWTAuthorizer = new NodejsFunction(that, 'LambdaJWTAuthorizer', {
        entry: join(__dirname, '..', '..', 'services', 'TokenService', 'Lambdas', 'lambdaJWTAuthorizer.ts'),
        handler: 'LambdaJWTAuthorizerHandler',
        functionName: 'JWTAuthorizer-Lambda',
        runtime: StaticEnvironment.LambdaSettinds.runtime,
        logRetention: StaticEnvironment.LambdaSettinds.logRetention,
        timeout: StaticEnvironment.LambdaSettinds.timeout.SHORT,
        environment: {
            region: StaticEnvironment.GlobalAWSEnvironment.region,
            botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
            accessTokenExpirationMinutes: StaticEnvironment.TokenService.accessTokenExpirationMinutes.toString(),
            refreshTokenExpirationDays: StaticEnvironment.TokenService.refreshTokenExpirationDays.toString(),
            allowedResources: StaticEnvironment.TokenService.allowedResources,
            AllowUsers: StaticEnvironment.TokenService.AllowUsers,
            ...StaticEnvironment.LambdaSettinds.EnvironmentVariables
        },
        bundling: {
            externalModules: ['aws-sdk', '/opt/*']
        },
        layers: layers
    });
    GrantAccessToDDB([LambdaJWTAuthorizer], tables);
    const authorizer = new apigateway.RequestAuthorizer(that, that.stackName + '-LambdaJWTAuthorizerObject', {
        authorizerName: that.stackName + '-LambdaJWTAuthorizerObject',
        handler: LambdaJWTAuthorizer,
        identitySources: [IdentitySource.header('cookie')],
        resultsCacheTtl: Duration.minutes(Number(StaticEnvironment.TokenService.authorizerCacheDurationMinutes))
    });

    const restServicesAPI = new apigateway.RestApi(that, that.stackName + '-GWAPI', {
        deploy: true,
        deployOptions: {
            stageName: 'SecureAPI',
            metricsEnabled: StaticEnvironment.APIGWSettings.cloudWatchMetricsEnabled,
            loggingLevel: StaticEnvironment.APIGWSettings.loggingLevel
        },
        defaultMethodOptions: {
            authorizationType: apigateway.AuthorizationType.CUSTOM,
            authorizer: authorizer
        },
        defaultCorsPreflightOptions: {
            allowHeaders: StaticEnvironment.APIGWSettings.allowHeaders,
            allowMethods: ['POST, GET', 'DELETE', 'PUT'],

            allowCredentials: true,
            allowOrigins: StaticEnvironment.APIGWSettings.allowOrigins
        }
    });
    const certificate = acm.Certificate.fromCertificateArn(that, 'imported-certificate', certificateARN);
    restServicesAPI.addUsagePlan(that.stackName + '-GWAPI' + '-UsagePlan', {
        name: that.stackName + '-GWAPI' + '-UsagePlan',

        apiStages: [{ api: restServicesAPI, stage: restServicesAPI.deploymentStage }],
        throttle: { burstLimit: 2, rateLimit: 100 },
        quota: { limit: 10000000, period: apigateway.Period.MONTH }
    });

    const APIDomainName = restServicesAPI.addDomainName(that.stackName + '-GW-SubDomain', {
        domainName: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain + '.' + siteDomain,
        certificate: certificate
    });

    const aRecord = new route53.ARecord(that, that.stackName + '-ARecord', {
        zone: myZone,
        recordName: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain + '.' + siteDomain,
        deleteExisting: true,
        target: route53.RecordTarget.fromAlias(new targets.ApiGateway(restServicesAPI))
    });
    return restServicesAPI;
}

export function ReturnGSIs(count: number) {
    const array = [];
    for (let i = 1; i <= count; i++) {
        array.push('GSI' + i);
    }
    return array;
}
export function GrantAccessToDDB(lambdas: NodejsFunction[], tables: ITable[]) {
    for (const table of tables) {
        for (const lambda of lambdas) {
            table.grantReadWriteData(lambda);
        }
    }
}
export function GrantAccessToSecrets(lambdas: NodejsFunction[]) {
    const statementSecretsManager = new PolicyStatement({
        resources: ['*'],
        actions: ['secretsmanager:*'],
        effect: Effect.ALLOW
    });

    for (const lambda of lambdas) {
        lambda.addToRolePolicy(statementSecretsManager);
    }
}

export function GrantAccessToS3(lambdas: NodejsFunction[], buckets: string[]) {
    for (const bucket of buckets) {
        const statementS3 = new PolicyStatement({
            resources: ['arn:aws:s3:::' + bucket + '/*', 'arn:aws:s3:::' + bucket],
            actions: ['s3:*'],
            effect: Effect.ALLOW
        });
        for (const lambda of lambdas) {
            lambda.addToRolePolicy(statementS3);
        }
    }
}
