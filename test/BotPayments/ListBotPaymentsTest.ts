import { ListBotPaymentsHandler } from 'services/BotPayments/ListBotPaymentsLambda';
const event = {
    resource: '/BotPayments/List',
    path: '/BotPayments/List/',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTcxMTc4Mzk4M30.dNf4YQgNuAEEUIWPiTp24sStzl4XFIxqDIAvz1REfbw',
        Host: 'secure-api.zuzona.com',
        'Postman-Token': 'a8d44ff9-28a2-4051-81d7-e436b911492d',
        'User-Agent': 'PostmanRuntime/7.31.3',
        'X-Amzn-Trace-Id': 'Root=1-64396db7-09400eb323ed3b47258dee04',
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
        Host: ['secure-api.zuzona.com'],
        'Postman-Token': ['a8d44ff9-28a2-4051-81d7-e436b911492d'],
        'User-Agent': ['PostmanRuntime/7.31.3'],
        'X-Amzn-Trace-Id': ['Root=1-64396db7-09400eb323ed3b47258dee04'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5795087844', type: 'NEW' },
    multiValueQueryStringParameters: { botId: ['5795087844'], type: ['NEW'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '5eiqeh',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDc5ODMsImV4cCI6MTY4MDI1MTU4M30.EjG7Ow12I4aRL6R2qkkp3u9P0XR-Zol6CD13BnYmNPg',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 67,
            id: '199163834',
            first_name: 'Nick',
            iat: '1680247983',
            username: 'LikeAHurricane'
        },
        resourcePath: '/BotPayments/List',
        httpMethod: 'GET',
        extendedRequestId: 'DX4UyGk3IAMFsng=',
        requestTime: '14/Apr/2023:15:13:59 +0000',
        path: '/BotPayments/List/',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1681485239956,
        requestId: '0f42d4d8-24ee-4631-99b9-d191f06a6041',
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
        apiId: 'vv49b6zsb3'
    },
    body: null,
    isBase64Encoded: false
};
async function main() {
    ListBotPaymentsHandler(event as any, '' as any);
}

main();
