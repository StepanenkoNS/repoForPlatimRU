import { APIGatewayProxyEvent , Context} from 'aws-lambda';
import { handler } from '../../../services/RegisterBot/getBot';

const b = {
    "botToken": "5129177159:AAFAS4_GBLgK9d4CNUb1re6U5qw43y0t70M",
    "admin": [
        "likeahurricane", "radiojoy"
    ]
}

const event : APIGatewayProxyEvent = 
{
    body: JSON.stringify(b),
    headers: {"Accept-Encoding": "gzip, deflate"},
    multiValueHeaders: {
        "Accept-Encoding": [
            "gzip, deflate"
        ]},
    httpMethod: "POST",
    isBase64Encoded: false,
    path: '',
    pathParameters: null,
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    stageVariables: null,

    requestContext: {
        resourceId: "6s10rh",
        resourcePath: "/MessageBotIntegration/v1/{proxy+}",
        httpMethod: "POST",
        extendedRequestId: "ZhvRAEK8IAMFYmA=",
        requestTime: "05/Oct/2022:10:40:57 +0000",
        path: "/test/MessageBotIntegration/v1/5647754848",
        accountId: "993738567487",
        protocol: "HTTP/1.1",
        stage: "test",
        domainPrefix: "616wfrep4m",
        requestTimeEpoch: 1664966457465,
        requestId: "9bf04521-90c6-4e6f-8116-d7be49fb465f",
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: "91.108.6.142",
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: "Amazon CloudFront",
            user: null,
            apiKey: "",
            apiKeyId: "",
            clientCert: null
        },

        domainName: "616wfrep4m.execute-api.us-east-1.amazonaws.com",
        apiId: "616wfrep4m",
        authorizer:null
    },
    resource: ''
}


const context : Context = {
    callbackWaitsForEmptyEventLoop: false,
    functionName: '',
    functionVersion: '',
    invokedFunctionArn: '',
    memoryLimitInMB: '',
    awsRequestId: '',
    logGroupName: '',
    logStreamName: '',
    getRemainingTimeInMillis: function (): number {
        throw new Error('Function not implemented.');
    },
    done: function (error?: Error | undefined, result?: any): void {
        throw new Error('Function not implemented.');
    },
    fail: function (error: string | Error): void {
        throw new Error('Function not implemented.');
    },
    succeed: function (messageOrObject: any): void {
        throw new Error('Function not implemented.');
    }
}

async function main() {

    handler(event, context);
    
}

main();