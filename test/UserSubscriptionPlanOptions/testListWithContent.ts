import { ListUserSubscriptionPlanOptionsWithContentHandler } from 'services/UserSubscriptionPlanOptions/ListUserSubscriptionPlanOptionsWithContentLambda';

const event = {
    resource: '/UserSubscriptionPlanOptions/List',
    path: '/UserSubscriptionPlanOptions/List',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwNzY4NzkzLCJleHAiOjE3MDIzMDQ3OTN9.mt7Yg1avwlVJSYRma163PTIlBNtzLrvm_bqrNBZdZpI; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTcxMDQzODEwOH0.pkfsMc5UPNhxUwcnvVe6xBO6SXH1DulgE7MSJVb6QsU',
        Host: 'secure-api.zuzona.com',
        'Postman-Token': 'bd4c55fe-9d5c-45c3-abb0-dbdfde892acc',
        'User-Agent': 'PostmanRuntime/7.31.3',
        'X-Amzn-Trace-Id': 'Root=1-64217572-27a7e73c3b821b75553dcccd',
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
        'Postman-Token': ['bd4c55fe-9d5c-45c3-abb0-dbdfde892acc'],
        'User-Agent': ['PostmanRuntime/7.31.3'],
        'X-Amzn-Trace-Id': ['Root=1-64217572-27a7e73c3b821b75553dcccd'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
        BOTUUID: '2MNHTeQWWxcV6r3T82vZQVzKR4l',
        userSubscriptionPlanId: '2Nat1opcDn9Ym4rT37YVLyNVBXr'
    },
    multiValueQueryStringParameters: {
        BOTUUID: ['2MNHTeQWWxcV6r3T82vZQVzKR4l'],
        userSubscriptionPlanId: ['2Nat1opcDn9Ym4rT37YVLyNVBXr']
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'inxefu',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg5MDIxMDgsImV4cCI6MTY3ODkwNTcwOH0.Uv3_Qs6Fm0pZa1dulCR5drcawZF3iu4qxfWeHqMfKgw',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 53,
            id: '199163834',
            first_name: 'Nick',
            iat: '1678902108',
            username: 'LikeAHurricane'
        },
        resourcePath: '/UserSubscriptionPlanOptions/List',
        httpMethod: 'GET',
        extendedRequestId: 'Cb9J-E2BIAMFYVA=',
        requestTime: '27/Mar/2023:10:52:34 +0000',
        path: '/UserSubscriptionPlanOptions/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1679914354736,
        requestId: 'dfe329a5-aaee-400f-9084-a5529e16b2d4',
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
    ListUserSubscriptionPlanOptionsWithContentHandler(event as any, {} as any);
}

main();
