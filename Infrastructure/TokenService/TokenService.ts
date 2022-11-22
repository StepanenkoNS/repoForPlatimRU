import { CfnOutput, Duration, Fn, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { join } from 'path';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { aws_apigatewayv2 as apigatewayv2 } from 'aws-cdk-lib';
//import * as apigatewayv2_alpha from '@aws-cdk/aws-apigatewayv2-alpha';

import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
//@ts-ignore
import * as DynamicEnvironment from '../../../ReadmeAndConfig/DynamicEnvironment';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { IdentitySource } from 'aws-cdk-lib/aws-apigateway';

export class TokenServiceStack extends Stack {
    constructor(
        scope: Construct,
        id: string,
        props: StackProps & {
            redeployGateWayEachTime: boolean;
        }
    ) {
        super(scope, id, props);
        const siteDomain = StaticEnvironment.WebResources.domainNames.domainName;
        const myZone = route53.HostedZone.fromLookup(this, 'Zone', {
            domainName: siteDomain
        });

        const certificate = acm.Certificate.fromCertificateArn(this, 'imported-certificate', DynamicEnvironment.Certificates.domainCertificateARN);
        const botsTable = Table.fromTableName(this, 'imported-BotsTable', StaticEnvironment.DynamoDbTables.botsTable.name);
        const modelsLayer = LayerVersion.fromLayerVersionArn(this, 'modelsLayer-imported', DynamicEnvironment.Layers.ModelsLayerARN);
        const utilsLayer = LayerVersion.fromLayerVersionArn(this, 'utilsLayer-imported', DynamicEnvironment.Layers.UtilsLayerARN);
        const typesLayer = LayerVersion.fromLayerVersionArn(this, 'typesLayer-imported', DynamicEnvironment.Layers.TypesLayer);
        const i18nLayer = LayerVersion.fromLayerVersionArn(this, 'i18nLayer-imported', DynamicEnvironment.Layers.I18NLayerARN);

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
                accessTokenExpirationMinutes: StaticEnvironment.EnvironmentVariables.accessTokenExpirationMinutes.toString(),
                refreshTokenExpirationDays: StaticEnvironment.EnvironmentVariables.refreshTokenExpirationDays.toString(),
                allowedOrigins: StaticEnvironment.WebResources.allowedOrigins.toString(),
                cookieDomain: StaticEnvironment.WebResources.domainNames.domainName
            },
            bundling: {
                externalModules: ['aws-sdk', '/opt/*']
            },
            layers: [utilsLayer, i18nLayer, typesLayer, modelsLayer]
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
                allowOrigins: StaticEnvironment.WebResources.allowedOrigins // [...StaticEnvironment.WebResources.allowedOrigins],
            }
        });

        TokenServiceAPIGW.root.addMethod('POST');
        // const deploymentId =
        //   this.stackName +
        //   "-GWAPI" +
        //   "-deployment" +
        //   (props.redeployGateWayEachTime === true
        //     ? "-" + new Date().toISOString()
        //     : "");

        // const deployment = new apigateway.Deployment(this, deploymentId, {
        //   api: TokenServiceAPIGW,
        //   //description : new Date().toISOString()
        // });

        const usagePlan = TokenServiceAPIGW.addUsagePlan(this.stackName + '-GWAPI' + '-UsagePlan', {
            name: this.stackName + '-GWAPI' + '-UsagePlan',
            apiStages: [{ api: TokenServiceAPIGW, stage: TokenServiceAPIGW.deploymentStage }],
            throttle: { burstLimit: 2, rateLimit: 100 },
            quota: { limit: 10000000, period: apigateway.Period.MONTH }
        });

        const APIDomainName = TokenServiceAPIGW.addDomainName(this.stackName + 'GW-SubDomain', {
            domainName: StaticEnvironment.WebResources.domainNames.tokenAPISubdomain + '.' + siteDomain,
            certificate: certificate
        });

        const aRecord = new route53.ARecord(this, 'TokenServiceAPIGWARecord', {
            zone: myZone,
            recordName: StaticEnvironment.WebResources.domainNames.tokenAPISubdomain + '.' + siteDomain,
            deleteExisting: true,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(TokenServiceAPIGW))
        });

        new CfnOutput(this, this.stackName + '-GWAPI' + '-tokenApi', {
            value: TokenServiceAPIGW.deploymentStage.urlForPath(),
            exportName: this.stackName + '-GWAPI' + '-tokenApi'
        });
    }
}
