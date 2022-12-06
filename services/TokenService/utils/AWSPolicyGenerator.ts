/// AWS Policy Generator creates the proper access to the function.
/// http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
export class AWSPolicyGenerator {
    static generate(principalId: string, effect: string, resource: string, context?: any): any {
        var authResponse: any = {};

        // console.log('resource', resource);
        // console.log('extendedResource', process.env.allowedResources!);
        authResponse.principalId = principalId;
        if (effect && resource) {
            const policyDocument: any = {};
            policyDocument.Version = '2012-10-17';
            policyDocument.Statement = [];
            const statementOne: any = {};
            statementOne.Action = 'execute-api:Invoke';
            statementOne.Effect = effect;
            statementOne.Resource = process.env.allowedResources!;
            //resource;
            policyDocument.Statement[0] = statementOne;
            authResponse.policyDocument = policyDocument;
        }

        if (context) {
            authResponse.context = context;
        }

        return authResponse;
    }
}
