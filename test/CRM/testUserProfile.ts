import { handler } from 'services/CRM/GetMyUserProfile';
const event = {
    resource: '/CRM/UserProfile',
    path: '/CRM/UserProfile',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgyODQyMDI1LCJleHAiOjE2ODI4NDU2MjV9.wLZJFSVCYm1cySPy2p1eZ7T9SaJPrWZQYg19cB5Z0zY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI3MDc1NDcsImV4cCI6MTcxNDI0MzU0N30.0GtB6N5fNLExRAH_qrHjiqc_gPz1s-f8zLOl7bpIySU',
        Host: 'secure-api.pompona.net',
        'Postman-Token': 'c2c8088a-7c21-439c-82de-7f5101da5c56',
        'User-Agent': 'PostmanRuntime/7.32.2',
        'X-Amzn-Trace-Id': 'Root=1-644e21b2-28b0c2096075b0d205cff969',
        'X-Forwarded-For': '176.232.60.170',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgyODQyMDI1LCJleHAiOjE2ODI4NDU2MjV9.wLZJFSVCYm1cySPy2p1eZ7T9SaJPrWZQYg19cB5Z0zY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI3MDc1NDcsImV4cCI6MTcxNDI0MzU0N30.0GtB6N5fNLExRAH_qrHjiqc_gPz1s-f8zLOl7bpIySU'
        ],
        Host: ['secure-api.pompona.net'],
        'Postman-Token': ['c2c8088a-7c21-439c-82de-7f5101da5c56'],
        'User-Agent': ['PostmanRuntime/7.32.2'],
        'X-Amzn-Trace-Id': ['Root=1-644e21b2-28b0c2096075b0d205cff969'],
        'X-Forwarded-For': ['176.232.60.170'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5795087844', id: '1862254' },
    multiValueQueryStringParameters: { botId: ['5795087844'], id: ['1862254'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'f7qq2v',
        authorizer: {
            principalId: '199163834',
            integrationLatency: 411,
            id: '199163834',
            exp: '1682845625',
            iat: '1682842025',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CRM/UserProfile',
        httpMethod: 'GET',
        extendedRequestId: 'ELoz_G5uIAMFkPQ=',
        requestTime: '30/Apr/2023:08:07:14 +0000',
        path: '/CRM/UserProfile',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1682842034828,
        requestId: '25e7207c-8ddf-4253-9008-ad8565b1c3b3',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.60.170',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.32.2',
            user: null
        },
        domainName: 'secure-api.pompona.net',
        apiId: 'icdpeahkaa'
    },
    body: null,
    isBase64Encoded: false
};
async function main() {
    const result = await handler(event as any, '' as any);
    console.log(result);
}

main();
