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

export class NotAuthorizedPagesStack extends Stack {
    constructor(
        scope: Construct,
        id: string,

        props: StackProps & {
            certificateARN: string;
            layerARNs: string[];
        }
    ) {
        super(scope, id, props);
        const webTable = Table.fromTableName(this, 'imported-webTable', StaticEnvironment.DynamoDbTables.webTable.name);

        const siteDomain = StaticEnvironment.WebResources.mainDomainName;
        const myZone = route53.HostedZone.fromLookup(this, 'Zone', {
            domainName: siteDomain
        });

        const webPagesAPI = new apigateway.RestApi(this, this.stackName + '-GWAPI', {
            deploy: true,
            deployOptions: {
                stageName: 'SecureAPI',
                metricsEnabled: true,
                loggingLevel: apigateway.MethodLoggingLevel.INFO
            },
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: ['POST, GET'],

                allowCredentials: true,
                allowOrigins: StaticEnvironment.WebResources.allowedOrigins
            }
        });

        const certificate = acm.Certificate.fromCertificateArn(this, 'imported-certificate', props.certificateARN);

        const layers: ILayerVersion[] = [];
        for (const layerARN of props.layerARNs) {
            layers.push(LayerVersion.fromLayerVersionArn(this, 'imported' + layerARN, layerARN));
        }

        const getWebPageDataLambda = new NodejsFunction(this, 'getWebPageDataLambda', {
            entry: join(__dirname, '..', '..', 'services', 'WebPages', 'GetWebPageData.ts'),
            handler: 'GetWebPageDataHandler',
            functionName: 'react-getWebPageData-Lambda',
            runtime: Runtime.NODEJS_16_X,
            environment: {
                webTable: StaticEnvironment.DynamoDbTables.webTable.name,
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
        webTable.grantReadWriteData(getWebPageDataLambda);

        const lambdaIntegrationListBots = new apigateway.LambdaIntegration(getWebPageDataLambda);
        webPagesAPI.root.addMethod('GET', lambdaIntegrationListBots);

        webPagesAPI.addUsagePlan(this.stackName + '-GWAPI' + '-UsagePlan', {
            name: this.stackName + '-GWAPI' + '-UsagePlan',

            apiStages: [{ api: webPagesAPI, stage: webPagesAPI.deploymentStage }],
            throttle: { burstLimit: 2, rateLimit: 100 },
            quota: { limit: 10000000, period: apigateway.Period.MONTH }
        });

        const APIDomainName = webPagesAPI.addDomainName(this.stackName + '-GW-SubDomain', {
            domainName: StaticEnvironment.WebResources.subDomains.apiBackend.pagesDataSubDomain + '.' + siteDomain,
            certificate: certificate
        });

        const aRecord = new route53.ARecord(this, this.stackName + '-ARecord', {
            zone: myZone,
            recordName: StaticEnvironment.WebResources.subDomains.apiBackend.backendAPISubdomain + '.' + siteDomain,
            deleteExisting: true,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(webPagesAPI))
        });

        new CfnOutput(this, this.stackName + '-APIGW-PagesAPI', {
            value: webPagesAPI.deploymentStage.urlForPath(),
            exportName: this.stackName + '-APIGW-PagesAPI'
        });
        // new CfnOutput(this, this.stackName + "-AuthoriserId", {
        //   value: authorizer.authorizerId,
        //   exportName: this.stackName + "-AuthoriserId",
        // });
    }
}
