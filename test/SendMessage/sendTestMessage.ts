import { handler } from 'services/SendMessage/SendTestMessageLambda';

const event = {
    resource: '/SendTestMessage/SendTestMessage',
    path: '/SendTestMessage/SendTestMessage',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODMxODE4MjgsImV4cCI6MTcxNDcxNzgyOH0.GnxWSXV4AmH6sbGvPSF3n_NbFOsBj4rJl7W_jggK9tU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzNTMwMTU0LCJleHAiOjE2ODM1MzM3NTR9.12fT8ctSIw6gZOrDLoPKlpk2Rjpm1TQq3xoIvXyQsR0',
        Host: 'secure-api.zuzona.com',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-6458a226-3dd446202d49206e738cede4',
        'X-Forwarded-For': '176.232.63.161',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODMxODE4MjgsImV4cCI6MTcxNDcxNzgyOH0.GnxWSXV4AmH6sbGvPSF3n_NbFOsBj4rJl7W_jggK9tU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzNTMwMTU0LCJleHAiOjE2ODM1MzM3NTR9.12fT8ctSIw6gZOrDLoPKlpk2Rjpm1TQq3xoIvXyQsR0'
        ],
        Host: ['secure-api.zuzona.com'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-6458a226-3dd446202d49206e738cede4'],
        'X-Forwarded-For': ['176.232.63.161'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'vd9l44',
        authorizer: {
            principalId: '199163834',
            integrationLatency: 0,
            id: '199163834',
            exp: '1683533754',
            iat: '1683530154',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendTestMessage',
        httpMethod: 'POST',
        extendedRequestId: 'El5GHGNsoAMFWCQ=',
        requestTime: '08/May/2023:07:17:58 +0000',
        path: '/SendTestMessage/SendTestMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1683530278830,
        requestId: '4b152929-5c08-4510-827a-f72171c561df',
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
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'u1y1q3vcq6'
    },
    body: '{"botId":5795087844,"sendMethod":"sendMessage","message":{"text":"<p>fsdafsdfadsfdsa</p>\\n","attachments":[]},"interaction":{"type":"NONE"},"contentPlanId":"PAIDPOST","contentPlanPostId":"DRAFT","trigger":{"type":"PAID_POST","prices":[{"price":10,"currency":"RUB"}]}}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any, '' as any);
}

main();
