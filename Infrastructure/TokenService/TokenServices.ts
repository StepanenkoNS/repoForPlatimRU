import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ILayerVersion, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { IRole } from 'aws-cdk-lib/aws-iam';

export class TokenServiceStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        props: StackProps & {
            certificateARN: string;
            layers: ILayerVersion[];
            lambdaRole: IRole;
        }
    ) {
        super(scope, id, props);
        const siteDomain = StaticEnvironment.WebResources.mainDomainName;
        const myZone = route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', {
            hostedZoneId: StaticEnvironment.WebResources.hostedZone.hostedZoneId,
            zoneName: StaticEnvironment.WebResources.hostedZone.zoneName
        });

        const certificate = acm.Certificate.fromCertificateArn(this, 'imported-certificate', props.certificateARN);

        const TokenServiceLambda = new NodejsFunction(this, 'TokenServiceLambda', {
            entry: join(__dirname, '..', '..', 'services', 'TokenService', 'Lambdas', 'lambdaTokenService.ts'),
            handler: 'handler',
            functionName: this.stackName + '-Lambda',
            runtime: StaticEnvironment.LambdaSettings.runtime,
            logRetention: StaticEnvironment.LambdaSettings.logRetention,
            role: props.lambdaRole,
            environment: {
                accessTokenExpirationMinutes: StaticEnvironment.TokenService.accessTokenExpirationMinutes.toString(),
                refreshTokenExpirationDays: StaticEnvironment.TokenService.refreshTokenExpirationDays.toString(),

                AllowUsers: StaticEnvironment.TokenService.AllowUsers,

                ...StaticEnvironment.LambdaSettings.EnvironmentVariables
            },
            bundling: {
                externalModules: StaticEnvironment.LambdaSettings.externalModules
            },
            layers: props.layers
        });

        const TokenServiceAPIGW = new apigateway.LambdaRestApi(this, this.stackName + '-GWAPI', {
            restApiName: this.stackName + '-GWAPI',
            handler: TokenServiceLambda,
            proxy: false,

            deploy: true,
            deployOptions: {
                stageName: 'GetToken',
                metricsEnabled: StaticEnvironment.APIGWSettings.cloudWatchMetricsEnabled,
                loggingLevel: StaticEnvironment.APIGWSettings.loggingLevel
            },
            // defaultMethodOptions: {
            //     authorizationType: apigateway.AuthorizationType.CUSTOM,
            //     authorizer: authorizer
            // },
            defaultCorsPreflightOptions: {
                allowHeaders: StaticEnvironment.APIGWSettings.allowHeaders,

                allowMethods: ['POST'],

                allowCredentials: true,
                allowOrigins: StaticEnvironment.APIGWSettings.allowOrigins
            }
        });

        TokenServiceAPIGW.root.addResource('me').addMethod('GET');
        TokenServiceAPIGW.root.addResource('getToken').addMethod('POST');
        TokenServiceAPIGW.root.addResource('logOut').addMethod('GET');

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
