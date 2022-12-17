import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

export function createAPI(that: any, enableAPICache: boolean, certificateARN: string) {
    const siteDomain = StaticEnvironment.WebResources.mainDomainName;
    const myZone = route53.HostedZone.fromLookup(that, 'Zone', {
        domainName: siteDomain
    });
    const certificate = acm.Certificate.fromCertificateArn(that, 'imported-certificate', certificateARN);
    let webPublicPagesAPI: apigateway.RestApi;
    if (enableAPICache) {
        webPublicPagesAPI = new apigateway.RestApi(that, that.stackName + '-GWAPI', {
            deploy: true,
            deployOptions: {
                stageName: 'pagesAPI',
                metricsEnabled: true,
                cachingEnabled: true,
                cacheClusterEnabled: true,
                cacheDataEncrypted: false,
                cacheTtl: Duration.minutes(60),
                loggingLevel: apigateway.MethodLoggingLevel.ERROR
            },
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: ['POST, GET'],

                allowCredentials: true,
                allowOrigins: StaticEnvironment.WebResources.allowedOrigins
            }
        });
    } else {
        webPublicPagesAPI = new apigateway.RestApi(that, that.stackName + '-GWAPI', {
            deploy: true,
            deployOptions: {
                stageName: 'pagesAPI',
                metricsEnabled: true,
                loggingLevel: apigateway.MethodLoggingLevel.ERROR
            },
            defaultCorsPreflightOptions: {
                allowHeaders: ['*'],
                allowMethods: ['POST, GET'],

                allowCredentials: true,
                allowOrigins: StaticEnvironment.WebResources.allowedOrigins
            }
        });
    }

    webPublicPagesAPI.addUsagePlan(that.stackName + '-GWAPI' + '-UsagePlan', {
        name: that.stackName + '-GWAPI' + '-UsagePlan',

        apiStages: [{ api: webPublicPagesAPI, stage: webPublicPagesAPI.deploymentStage }],
        throttle: { burstLimit: 2, rateLimit: 100 },
        quota: { limit: 10000000, period: apigateway.Period.MONTH }
    });

    const APIDomainName = webPublicPagesAPI.addDomainName(that.stackName + '-GW-SubDomain', {
        domainName: StaticEnvironment.WebResources.subDomains.apiBackend.pagesDataSubDomain + '.' + siteDomain,
        certificate: certificate
    });

    const aRecord = new route53.ARecord(that, that.stackName + '-ARecord', {
        zone: myZone,
        recordName: StaticEnvironment.WebResources.subDomains.apiBackend.pagesDataSubDomain + '.' + siteDomain,
        deleteExisting: true,
        target: route53.RecordTarget.fromAlias(new targets.ApiGateway(webPublicPagesAPI))
    });

    return webPublicPagesAPI;
}

export function GrantAccessToDDB(lambdas: NodejsFunction[], tables: ITable[]) {
    for (const table of tables) {
        for (const lambda of lambdas) {
            table.grantReadWriteData(lambda);
        }
    }
}

export function addMethod(rootResource: apigateway.Resource, resourceName: string | undefined, method: 'GET' | 'POST', lambdaIntegrationObject: apigateway.LambdaIntegration, enableAPICache: boolean) {
    let resource;
    if (resourceName === undefined || resourceName === '') {
        resource = rootResource;
    } else {
        resource = rootResource.addResource(resourceName);
    }

    if (enableAPICache) {
        resource.addMethod(method, lambdaIntegrationObject, {
            requestParameters: {
                'method.request.path.url': true,
                'method.request.path.format': true
            }
        });
    } else {
        resource.addMethod(method, lambdaIntegrationObject);
    }
}

export function addLambdaIntegration(lambda: NodejsFunction, enableAPICache: boolean) {
    if (enableAPICache) {
        return new apigateway.LambdaIntegration(lambda, {
            cacheKeyParameters: ['method.request.path.url', 'method.request.path.format'],
            requestParameters: {
                'integration.request.path.url': 'method.request.path.url',
                'integration.request.path.format': 'method.request.path.format'
            }
        });
    } else {
        return new apigateway.LambdaIntegration(lambda);
    }
}
