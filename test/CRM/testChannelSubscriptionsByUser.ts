import { handler } from 'services/CRM/ChannelSubscriptionsByUser';
const event = {
    resource: '/CRM/ListMyChannelSubscriptionsByUser',
    path: '/CRM/ListMyChannelSubscriptionsByUser',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzNjAyNDUzLCJleHAiOjE2ODM2MDYwNTN9.ShVRcT2kh0SfThv9DJTsbgAQzYuc-TAvRZPPHcMU5GQ; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI3MDc1NDcsImV4cCI6MTcxNDI0MzU0N30.0GtB6N5fNLExRAH_qrHjiqc_gPz1s-f8zLOl7bpIySU',
        Host: 'secure-api.zuzona.com',
        'Postman-Token': '0b4a9d72-e921-4390-a38e-acc1bca86082',
        'User-Agent': 'PostmanRuntime/7.32.2',
        'X-Amzn-Trace-Id': 'Root=1-6459c53c-0bf9034f6ccc6afc296bde3d',
        'X-Forwarded-For': '176.232.63.161',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzNjAyNDUzLCJleHAiOjE2ODM2MDYwNTN9.ShVRcT2kh0SfThv9DJTsbgAQzYuc-TAvRZPPHcMU5GQ; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI3MDc1NDcsImV4cCI6MTcxNDI0MzU0N30.0GtB6N5fNLExRAH_qrHjiqc_gPz1s-f8zLOl7bpIySU'
        ],
        Host: ['secure-api.zuzona.com'],
        'Postman-Token': ['0b4a9d72-e921-4390-a38e-acc1bca86082'],
        'User-Agent': ['PostmanRuntime/7.32.2'],
        'X-Amzn-Trace-Id': ['Root=1-6459c53c-0bf9034f6ccc6afc296bde3d'],
        'X-Forwarded-For': ['176.232.63.161'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5795087844', id: '199163834' },
    multiValueQueryStringParameters: { botId: ['5795087844'], id: ['199163834'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'fh7b54',
        authorizer: {
            principalId: '199163834',
            integrationLatency: 0,
            id: '199163834',
            exp: '1683606053',
            iat: '1683602453',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CRM/ListMyChannelSubscriptionsByUser',
        httpMethod: 'GET',
        extendedRequestId: 'EovBbEBuIAMFqKA=',
        requestTime: '09/May/2023:03:59:56 +0000',
        path: '/CRM/ListMyChannelSubscriptionsByUser',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1683604796053,
        requestId: 'b99f6817-c841-41cc-a9a0-a52dbbabdb76',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.63.161',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.32.2',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'elt7p97uj9'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any, '' as any);
    console.log(result);
}

main();
