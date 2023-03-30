import { ListTelegramFilesHandler } from 'services/TelegramFiles/ListTelegramFilesLambda';
const event = {
    resource: '/TelegramFiles/List',
    path: '/TelegramFiles/List',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTcxMDQzODEwOH0.pkfsMc5UPNhxUwcnvVe6xBO6SXH1DulgE7MSJVb6QsU',
        Host: 'secure-api.zuzona.com',
        'Postman-Token': '071ab54d-7d62-4e90-aa6c-3b39335e9cde',
        'User-Agent': 'PostmanRuntime/7.31.3',
        'X-Amzn-Trace-Id': 'Root=1-64245bc7-7040c500674a2edc69375755',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTcxMDQzODEwOH0.pkfsMc5UPNhxUwcnvVe6xBO6SXH1DulgE7MSJVb6QsU'
        ],
        Host: ['secure-api.zuzona.com'],
        'Postman-Token': ['071ab54d-7d62-4e90-aa6c-3b39335e9cde'],
        'User-Agent': ['PostmanRuntime/7.31.3'],
        'X-Amzn-Trace-Id': ['Root=1-64245bc7-7040c500674a2edc69375755'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5795087844', tags: '' },
    multiValueQueryStringParameters: { botId: ['5795087844'], tags: [''] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'frmo5w',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 97,
            id: '199163834',
            first_name: 'Nick',
            iat: '1678902108',
            username: 'LikeAHurricane'
        },
        resourcePath: '/TelegramFiles/List',
        httpMethod: 'GET',
        extendedRequestId: 'CjNHMERXoAMFz_Q=',
        requestTime: '29/Mar/2023:15:39:51 +0000',
        path: '/TelegramFiles/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1680104391379,
        requestId: '14d27576-358c-4f47-b950-f63ef390c7eb',
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
    body: null,
    isBase64Encoded: false
};
async function main() {
    ListTelegramFilesHandler(event as any, '' as any);
}

main();
