import { LambdaJWTAuthorizerHandler } from '../../Infrastructure/TokenService/Lambdas/lambdaJWTAuthorizer';
const event = {
    type: 'REQUEST',
    methodArn: 'arn:aws:execute-api:us-east-1:993738567487:hr7gpcp5hc/tokenApi/POST/getNewToken',
    resource: '/getNewToken',
    path: '/tokenApi/getNewToken',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'Content-Length': '170',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwMTc0MDEyLCJleHAiOjE3MDE3MTAwMTJ9.3S-zaLRahNq8ot5hGfOJM6PCnCLSwSWFBLEzF00XUa4; Secure; SameSite=None; Domain=.zuzona.com; Path=/',
        Host: 'auth.zuzona.com',
        origin: 'http://localhost',
        referer: 'http://localhost/',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-637674b7-48cd9d822492d82d2118e0c8',
        'X-Forwarded-For': '176.232.60.171',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'Content-Length': ['170'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2Njg3MDUzMTgsImV4cCI6MTcwMDI0MTMxOH0.Bw0wFEbeSavCEG0qNsicHTDPZjglFJn3Ol4yb76euV8'
        ],
        Host: ['auth.zuzona.com'],
        origin: ['http://localhost'],
        referer: ['http://localhost/'],
        'sec-ch-ua': ['"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'user-agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-637674b7-48cd9d822492d82d2118e0c8'],
        'X-Forwarded-For': ['176.232.60.171'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {},
    multiValueQueryStringParameters: {},
    pathParameters: {},
    stageVariables: {},
    requestContext: {
        resourceId: 'p5imol',
        resourcePath: '/getNewToken',
        httpMethod: 'POST',
        extendedRequestId: 'bwcssHK4oAMFarw=',
        requestTime: '17/Nov/2022:17:51:51 +0000',
        path: '/tokenApi/getNewToken',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'tokenApi',
        domainPrefix: 'auth',
        requestTimeEpoch: 1668707511424,
        requestId: 'afedace6-c2cb-428a-8d47-2d0309e61fe3',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.60.171',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'auth.zuzona.com',
        apiId: 'hr7gpcp5hc'
    }
};

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    LambdaJWTAuthorizerHandler(event, {});
}

main();
