import { handler } from 'services/BotLanding/GetBotLandingPublic';

const event = {
    resource: '/bot-landing',
    path: '/bot-landing',
    httpMethod: 'GET',
    headers: {
        Accept: 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        Host: 'public-pages.zuzona.com',
        'User-Agent': 'axios/1.1.3',
        'X-Amzn-Trace-Id': 'Root=1-64704d71-093f936e06f36d1b00f6ef86',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['application/json, text/plain, */*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Content-Type': ['application/json'],
        Host: ['public-pages.zuzona.com'],
        'User-Agent': ['axios/1.1.3'],
        'X-Amzn-Trace-Id': ['Root=1-64704d71-093f936e06f36d1b00f6ef86'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'lq4l3m',
        resourcePath: '/bot-landing',
        httpMethod: 'GET',
        extendedRequestId: 'FhEJxFGpoAMF_VA=',
        requestTime: '26/May/2023:06:10:57 +0000',
        path: '/bot-landing',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'public-pages',
        requestTimeEpoch: 1685081457414,
        requestId: '25ec5f24-9689-4687-91e7-387b81605e23',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.63.145',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'axios/1.1.3',
            user: null
        },
        domainName: 'public-pages.zuzona.com',
        apiId: 'fxs3adsi8g'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
