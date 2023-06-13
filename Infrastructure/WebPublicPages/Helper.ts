import { Duration } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as StaticEnvironment from '../../../Core/ReadmeAndConfig/StaticEnvironment';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

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
