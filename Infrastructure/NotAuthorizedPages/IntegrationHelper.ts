import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Duration } from 'aws-cdk-lib';
import * as StaticEnvironment from '../../../ReadmeAndConfig/StaticEnvironment';

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

export function addApigateway(that: any, enableAPICache: boolean) {
    if (enableAPICache) {
        return new apigateway.RestApi(that, that.stackName + '-GWAPI', {
            deploy: true,
            deployOptions: {
                stageName: 'pagesAPI',
                metricsEnabled: true,
                cachingEnabled: true,
                cacheClusterEnabled: true,
                cacheDataEncrypted: false,
                cacheTtl: Duration.minutes(30),
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
        return new apigateway.RestApi(that, that.stackName + '-GWAPI', {
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
}

export function addMethod(rootResource: apigateway.Resource, resourceName: string, method: 'GET' | 'POST', lambdaIntegrationObject: apigateway.LambdaIntegration, enableAPICache: boolean) {
    if (enableAPICache) {
        rootResource.addResource(resourceName).addMethod(method, lambdaIntegrationObject, {
            requestParameters: {
                'method.request.path.url': true,
                'method.request.path.format': true
            }
        });
    } else {
        rootResource.addResource(resourceName).addMethod(method, lambdaIntegrationObject);
    }
}
