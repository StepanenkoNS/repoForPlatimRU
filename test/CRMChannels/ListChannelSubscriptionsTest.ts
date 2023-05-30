import { handler } from 'services/CRMChannels/ListChannelSubscriptions';
const event = {
    resource: '/CRMChannels/ListSubscriptions',
    path: '/CRMChannels/ListSubscriptions/',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTcxMTc4Mzk4M30.dNf4YQgNuAEEUIWPiTp24sStzl4XFIxqDIAvz1REfbw',
        Host: 'secure-api.pompona.net',
        'Postman-Token': 'a795ce8e-d945-4f70-a28b-73e35e385839',
        'User-Agent': 'PostmanRuntime/7.31.3',
        'X-Amzn-Trace-Id': 'Root=1-643910f7-4476191d2b01291c227b6f13',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTcxMTc4Mzk4M30.dNf4YQgNuAEEUIWPiTp24sStzl4XFIxqDIAvz1REfbw'
        ],
        Host: ['secure-api.pompona.net'],
        'Postman-Token': ['a795ce8e-d945-4f70-a28b-73e35e385839'],
        'User-Agent': ['PostmanRuntime/7.31.3'],
        'X-Amzn-Trace-Id': ['Root=1-643910f7-4476191d2b01291c227b6f13'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5795087844' },
    multiValueQueryStringParameters: { botId: ['5795087844'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'v9xeth',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 1567,
            id: '199163834',
            first_name: 'Nick',
            iat: '1680247983',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CRMChannels/ListSubscriptions',
        httpMethod: 'GET',
        extendedRequestId: 'DW-WxHBXoAMFc4w=',
        requestTime: '14/Apr/2023:08:38:15 +0000',
        path: '/CRMChannels/ListSubscriptions/',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1681461495807,
        requestId: '8a7c7b12-2f13-41ac-8df7-72b4222f1c49',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.62.238',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.31.3',
            user: null
        },
        domainName: 'secure-api.pompona.net',
        apiId: 'vv49b6zsb3'
    },
    body: null,
    isBase64Encoded: false
};
async function main() {
    handler(event as any, '' as any);
}

main();
