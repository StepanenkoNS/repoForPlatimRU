import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ILayerVersion, LayerVersion, Permission, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class RestServicesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            certificateARN: string;
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);
        const siteDomain = StaticEnvironment.WebResources.mainDomainName;
        const myZone = route53.HostedZone.fromLookup(this, 'Zone', {
            domainName: siteDomain
        });

        const LambdaJWTAuthorizer = new NodejsFunction(this, 'LambdaJWTAuthorizer', {
            entry: join(__dirname, '..', '..', 'services', 'TokenService', 'Lambdas', 'lambdaJWTAuthorizer.ts'),
            handler: 'LambdaJWTAuthorizerHandler',
            functionName: this.stackName + '-JWTAuthorizer-Lambda',
            runtime: Runtime.NODEJS_16_X,
            logRetention: RetentionDays.INFINITE,
            environment: {
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                BOT_FATHER_TOKEN: StaticEnvironment.EnvironmentVariables.BOT_FATHER_TOKEN,
                accessTokenExpirationMinutes: StaticEnvironment.TokenService.accessTokenExpirationMinutes.toString(),
                refreshTokenExpirationDays: StaticEnvironment.TokenService.refreshTokenExpirationDays.toString(),
                hashSalt: StaticEnvironment.TokenService.hashSalt
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            }
        });
        const authorizer = new apigateway.RequestAuthorizer(this, this.stackName + '-LambdaJWTAuthorizerObject', {
            authorizerName: this.stackName + '-LambdaJWTAuthorizerObject',
            handler: LambdaJWTAuthorizer,
            identitySources: [IdentitySource.header('cookie')],
            resultsCacheTtl: Duration.minutes(Number(StaticEnvironment.TokenService.authorizerCacheDurationMinutes))
        });

        const restServicesAPI = new apigateway.RestApi(this, this.stackName + '-GWAPI', {
            deploy: true,
            deployOptions: {
                stageName: 'SecureAPI',
                metricsEnabled: true,
                loggingLevel: apigateway.MethodLoggingLevel.INFO
            },
            defaultMethodOptions: {
                authorizationType: apigateway.AuthorizationType.CUSTOM,
                authorizer: authorizer
            },
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: ['POST, GET'],

                allowCredentials: true,
                allowOrigins: StaticEnvironment.WebResources.allowedOrigins // [...StaticEnvironment.WebResources.allowedOrigins],
            }
        });

        const certificate = acm.Certificate.fromCertificateArn(this, 'imported-certificate', props.certificateARN);

        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const ListBotsLambda = new NodejsFunction(this, 'ListBotsLambda', {
            entry: join(__dirname, '..', '..', 'services', 'Bots', 'ListMyBots.ts'),
            handler: 'ListMyBotsHandler',
            functionName: 'react-ListBots-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });
        botsTable.grantReadWriteData(ListBotsLambda);

        const lambdaBotsRootResource = restServicesAPI.root.addResource('Bots');
        const lambdaGetMyBotsResource = lambdaBotsRootResource.addResource('GetMyBots');
        const lambdaIntegrationListBots = new apigateway.LambdaIntegration(ListBotsLambda);
        lambdaGetMyBotsResource.addMethod('GET', lambdaIntegrationListBots);

        restServicesAPI.addUsagePlan(this.stackName + '-GWAPI' + '-UsagePlan', {
            name: this.stackName + '-GWAPI' + '-UsagePlan',

            apiStages: [{ api: restServicesAPI, stage: restServicesAPI.deploymentStage }],
            throttle: { burstLimit: 2, rateLimit: 100 },
            quota: { limit: 10000000, period: apigateway.Period.MONTH }
        });

        const APIDomainName = restServicesAPI.addDomainName(this.stackName + '-GW-SubDomain', {
            domainName: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain + '.' + siteDomain,
            certificate: certificate
        });

        const aRecord = new route53.ARecord(this, this.stackName + '-ARecord', {
            zone: myZone,
            recordName: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain + '.' + siteDomain,
            deleteExisting: true,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(restServicesAPI))
        });

        new CfnOutput(this, this.stackName + '-APIGW-SecureAPI', {
            value: restServicesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-SecureAPI'
        });
        // new CfnOutput(this, this.stackName + "-AuthoriserId", {
        //   value: authorizer.authorizerId,
        //   exportName: this.stackName + "-AuthoriserId",
        // });
    }
}
