import { UpdateBotLandingHandler } from 'services/WebBotLandingPages/UpdateBotLanding';

const event = {
    resource: '/Landing',
    path: '/Landing',
    httpMethod: 'PUT',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTcxMTc4Mzk4M30.dNf4YQgNuAEEUIWPiTp24sStzl4XFIxqDIAvz1REfbw',
        Host: 'secure-api.zuzona.com',
        'Postman-Token': '9c1e2d4b-96f6-49a1-b04e-f499d00922c1',
        'User-Agent': 'PostmanRuntime/7.31.3',
        'X-Amzn-Trace-Id': 'Root=1-6431a2d4-7c62158b6dc552e05b7f1b88',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        'Content-Type': ['application/json'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTcxMTc4Mzk4M30.dNf4YQgNuAEEUIWPiTp24sStzl4XFIxqDIAvz1REfbw'
        ],
        Host: ['secure-api.zuzona.com'],
        'Postman-Token': ['9c1e2d4b-96f6-49a1-b04e-f499d00922c1'],
        'User-Agent': ['PostmanRuntime/7.31.3'],
        'X-Amzn-Trace-Id': ['Root=1-6431a2d4-7c62158b6dc552e05b7f1b88'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'qrwm1f',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 43,
            id: '199163834',
            first_name: 'Nick',
            iat: '1680247983',
            username: 'LikeAHurricane'
        },
        resourcePath: '/Landing',
        httpMethod: 'PUT',
        extendedRequestId: 'DEZhRF3boAMFiRQ=',
        requestTime: '08/Apr/2023:17:22:28 +0000',
        path: '/Landing',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1680974548651,
        requestId: 'f3cdbb30-8329-4639-8fd5-213e30269ddc',
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
        domainName: 'secure-api.zuzona.com',
        apiId: 'fj31pj6yc1'
    },
    body: '{"body":"asdfasdfadsfds","title":"asdfdas","botId":5647754848,"subdomain":"nick_test_1234_bot"}',
    isBase64Encoded: false
};

async function main() {
    UpdateBotLandingHandler(event as any);
}

main();
