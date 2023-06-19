import { handler } from 'services/WebPublicPages/Admin-GetPageContent';
const event = {
    resource: '/adminContent',
    path: '/adminContent',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUXNPU3B2bXkwUVVWVnlaNEZnb054SjF1ZWEiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQyMjoxMzo0MS4zMDNaIiwiREYiOiIyMDI0LTA3LTA0VDIyOjEzOjQxLjMwM1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Mn0sImlhdCI6MTY4NjkyOTkwNSwiZXhwIjoxNzE4NDY1OTA1fQ.IXP5Jj7ibwL3nKbLKEAt_hvyjBLH-WiYI6ihkBWrDbE',
        Host: 'public-pages.pompona.net',
        'Postman-Token': 'a3fa7452-8a1f-4131-81c7-f85b259f6020',
        'User-Agent': 'PostmanRuntime/7.32.3',
        'X-Amzn-Trace-Id': 'Root=1-648fed9a-272040e8772ac5ff5f02520e',
        'X-Forwarded-For': '176.232.59.41',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUXNPU3B2bXkwUVVWVnlaNEZnb054SjF1ZWEiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQyMjoxMzo0MS4zMDNaIiwiREYiOiIyMDI0LTA3LTA0VDIyOjEzOjQxLjMwM1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Mn0sImlhdCI6MTY4NjkyOTkwNSwiZXhwIjoxNzE4NDY1OTA1fQ.IXP5Jj7ibwL3nKbLKEAt_hvyjBLH-WiYI6ihkBWrDbE'
        ],
        Host: ['public-pages.pompona.net'],
        'Postman-Token': ['a3fa7452-8a1f-4131-81c7-f85b259f6020'],
        'User-Agent': ['PostmanRuntime/7.32.3'],
        'X-Amzn-Trace-Id': ['Root=1-648fed9a-272040e8772ac5ff5f02520e'],
        'X-Forwarded-For': ['176.232.59.41'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
        locale: 'ru',
        pagePath: 'oferta'
    },
    multiValueQueryStringParameters: {
        locale: ['ru'],
        pagePath: ['oferta']
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '56spqo',
        resourcePath: '/adminContent',
        httpMethod: 'GET',
        extendedRequestId: 'GwIQLEixoAMFmxg=',
        requestTime: '19/Jun/2023:05:54:34 +0000',
        path: '/adminContent',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'public-pages',
        requestTimeEpoch: 1687154074433,
        requestId: '3c1bbdf1-f0cd-4e93-8d24-79e297ceb2a6',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.59.41',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.32.3',
            user: null
        },
        domainName: 'public-pages.pompona.net',
        apiId: 'npeckz4eu3'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
