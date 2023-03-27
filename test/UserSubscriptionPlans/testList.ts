import { ListUserSubscriptionPlansHandler } from 'services/UserSubscriptionPlans/ListUserSubscriptionPlansLambda';

const event = {
    resource: '/UserSubscriptionPlans/List',
    path: '/UserSubscriptionPlans/List',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwNzY4NzkzLCJleHAiOjE3MDIzMDQ3OTN9.mt7Yg1avwlVJSYRma163PTIlBNtzLrvm_bqrNBZdZpI; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTcxMDQzODEwOH0.pkfsMc5UPNhxUwcnvVe6xBO6SXH1DulgE7MSJVb6QsU',
        Host: 'secure-api.zuzona.com',
        'Postman-Token': '413a2aad-5591-4917-b3c8-a270a10621d3',
        'User-Agent': 'PostmanRuntime/7.31.3',
        'X-Amzn-Trace-Id': 'Root=1-64215b93-6544811460e4af91535a33e2',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwNzY4NzkzLCJleHAiOjE3MDIzMDQ3OTN9.mt7Yg1avwlVJSYRma163PTIlBNtzLrvm_bqrNBZdZpI; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTcxMDQzODEwOH0.pkfsMc5UPNhxUwcnvVe6xBO6SXH1DulgE7MSJVb6QsU'
        ],
        Host: ['secure-api.zuzona.com'],
        'Postman-Token': ['413a2aad-5591-4917-b3c8-a270a10621d3'],
        'User-Agent': ['PostmanRuntime/7.31.3'],
        'X-Amzn-Trace-Id': ['Root=1-64215b93-6544811460e4af91535a33e2'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { BOTUUID: '2MNHTeQWWxcV6r3T82vZQVzKR4l' },
    multiValueQueryStringParameters: { BOTUUID: ['2MNHTeQWWxcV6r3T82vZQVzKR4l'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '3f13c7',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 109,
            id: '199163834',
            first_name: 'Nick',
            iat: '1678902108',
            username: 'LikeAHurricane'
        },
        resourcePath: '/UserSubscriptionPlans/List',
        httpMethod: 'GET',
        extendedRequestId: 'Cbs_DHbZIAMF-aQ=',
        requestTime: '27/Mar/2023:09:02:11 +0000',
        path: '/UserSubscriptionPlans/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1679907731275,
        requestId: 'df3b3e66-f678-4dbb-b507-e7c9bc67a6df',
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
        apiId: 'adt5y4hohl'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    ListUserSubscriptionPlansHandler(event as any, {} as any);
}

main();
