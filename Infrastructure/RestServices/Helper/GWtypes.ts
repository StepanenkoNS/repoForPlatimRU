import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export type LambdaAndResource = {
    lambda: NodejsFunction;
    resource: string | undefined;
    httpMethod: string;
};

export type LambdaIntegrations = {
    rootResource: string;
    lambdas: LambdaAndResource[];
};
