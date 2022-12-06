import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { aws_apigatewayv2 as apigatewayv2 } from 'aws-cdk-lib';
//import * as apigatewayv2_alpha from '@aws-cdk/aws-apigatewayv2-alpha';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class TokenServiceStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        props: StackProps & {
            certificateARN: string;
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        const siteDomain = StaticEnvironment.WebResources.mainDomainName;
        const myZone = route53.HostedZone.fromLookup(this, 'Zone', {
            domainName: siteDomain
        });

        const certificate = acm.Certificate.fromCertificateArn(this, 'imported-certificate', props.certificateARN);
        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);

        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const TokenServiceLambda = new NodejsFunction(this, 'TokenServiceLambda', {
            entry: join(__dirname, '..', '..', 'services', 'TokenService', 'Lambdas', 'lambdaTokenService.ts'),
            handler: 'LambdaTokenServiceHandler',
            functionName: this.stackName + '-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                botsTable: StaticEnvironment.DynamoDbTables.botsTable.name,
                region: StaticEnvironment.GlobalAWSEnvironment.region,
                NODE_ENV: StaticEnvironment.EnvironmentVariables.NODE_ENV,
                botFatherId: StaticEnvironment.EnvironmentVariables.botFatherId,
                BOT_FATHER_TOKEN: StaticEnvironment.EnvironmentVariables.BOT_FATHER_TOKEN,
                accessTokenExpirationMinutes: StaticEnvironment.TokenService.accessTokenExpirationMinutes.toString(),
                refreshTokenExpirationDays: StaticEnvironment.TokenService.refreshTokenExpirationDays.toString(),
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.mainDomainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: layers
        });
        botsTable.grantReadWriteData(TokenServiceLambda);

        const TokenServiceAPIGW = new apigateway.LambdaRestApi(this, this.stackName + '-GWAPI', {
            restApiName: this.stackName + '-GWAPI',
            handler: TokenServiceLambda,
            proxy: false,
            deploy: true,
            deployOptions: {
                stageName: 'GetToken',
                metricsEnabled: true,
                loggingLevel: apigateway.MethodLoggingLevel.INFO
            },
            // defaultMethodOptions: {
            //     authorizationType: apigateway.AuthorizationType.CUSTOM,
            //     authorizer: authorizer
            // },
            defaultCorsPreflightOptions: {
                allowHeaders: [
                    '*'
                    // 'Content-Type',
                    // 'X-Amz-Date',
                    // 'Authorization',
                    // 'X-Api-Key',
                    // 'X-Requested-With',
                    // 'X-Requested-With, X-HTTP-Method-Override',
                    // 'Access-Control-Allow-Origin',
                    // 'Access-Control-Allow-Method',
                    // 'Access-Control-Allow-Headers',
                    // 'Access-Control-Allow-Credentials',
                    // 'Origin'
                ],
                allowMethods: ['POST'],

                allowCredentials: true,
                allowOrigins: StaticEnvironment.WebResources.allowedOrigins
            }
        });

        TokenServiceAPIGW.root.addResource('me').addMethod('GET');
        TokenServiceAPIGW.root.addResource('getToken').addMethod('POST');

        const usagePlan = TokenServiceAPIGW.addUsagePlan(this.stackName + '-GWAPI' + '-UsagePlan', {
            name: this.stackName + '-GWAPI' + '-UsagePlan',
            apiStages: [{ api: TokenServiceAPIGW, stage: TokenServiceAPIGW.deploymentStage }],
            throttle: { burstLimit: 2, rateLimit: 100 },
            quota: { limit: 10000000, period: apigateway.Period.MONTH }
        });

        const APIDomainName = TokenServiceAPIGW.addDomainName(this.stackName + 'GW-SubDomain', {
            domainName: StaticEnvironment.WebResources.subDomains.apiBackend.tokenAPISubdomain + '.' + siteDomain,
            certificate: certificate
        });

        const aRecord = new route53.ARecord(this, 'TokenServiceAPIGWARecord', {
            zone: myZone,
            recordName: StaticEnvironment.WebResources.subDomains.apiBackend.tokenAPISubdomain + '.' + siteDomain,
            deleteExisting: true,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(TokenServiceAPIGW))
        });

        new CfnOutput(this, this.stackName + '-GWAPI' + '-tokenApi', {
            value: TokenServiceAPIGW.deploymentStage.urlForPath(),
            exportName: this.stackName + '-GWAPI' + '-tokenApi'
        });
    }
}
