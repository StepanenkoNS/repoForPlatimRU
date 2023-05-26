import { handler } from 'services/Bots/ListBotsLambda';
const event = {
    resource: '/Bots/List',
    path: '/Bots/List',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        cookie: '_ym_uid=1682772854818099613; _ym_d=1682772854; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUUh1MVQ4dDMxUHVXSUtveThnbm1qTElsSHgiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjVUMTM6NTA6MTIuNzcyWiIsIkRGIjoiMjAyNC0wNS0yNFQxMzo1MDoxMi43NzJaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODUwMjUxNDUsImV4cCI6MTcxNjU2MTE0NX0.SnZi2U-MLInfVwLP_npJ7MqnAmMJJwVeAqgU9HvkUew; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTI1VDE0OjUwOjU5LjM3N1oiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMjZUMTQ6NTA6NTkuMzc4WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUUtxWFRHUHNaSmVTMDBpY3ZwN1NTTk1zUHUiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMjZUMTQ6NTA6NTkuMzc3WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODUxMTkzOTksImV4cCI6MTY4NTExOTY5OX0.Z3PvETiverSVUCzYUISCOQj9vin1wndi1OM7LJMX--o',
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
        'X-Amzn-Trace-Id': 'Root=1-6470e1a7-0bcbc9024f4f2059798dbd72',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        cookie: [
            '_ym_uid=1682772854818099613; _ym_d=1682772854; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUUh1MVQ4dDMxUHVXSUtveThnbm1qTElsSHgiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjVUMTM6NTA6MTIuNzcyWiIsIkRGIjoiMjAyNC0wNS0yNFQxMzo1MDoxMi43NzJaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODUwMjUxNDUsImV4cCI6MTcxNjU2MTE0NX0.SnZi2U-MLInfVwLP_npJ7MqnAmMJJwVeAqgU9HvkUew; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTI1VDE0OjUwOjU5LjM3N1oiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMjZUMTQ6NTA6NTkuMzc4WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUUtxWFRHUHNaSmVTMDBpY3ZwN1NTTk1zUHUiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMjZUMTQ6NTA6NTkuMzc3WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODUxMTkzOTksImV4cCI6MTY4NTExOTY5OX0.Z3PvETiverSVUCzYUISCOQj9vin1wndi1OM7LJMX--o'
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
        'X-Amzn-Trace-Id': ['Root=1-6470e1a7-0bcbc9024f4f2059798dbd72'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'l7vvll',
        authorizer: {
            zuzonaSubscription:
                '{"masterId":199163834,"DF":"2024-05-25T14:50:59.377Z","datePaid":"2023-05-26T14:50:59.378Z","subscriptionLevel":1,"subscriptionPlan":"PAIDBOT","currency":"RUB","id":"2QKqXTGPsZJeS00icvp7SSNMsPu","pricePaid":20000,"DS":"2023-05-26T14:50:59.377Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 1179,
            id: '199163834',
            exp: '1685119699',
            first_name: 'Nick',
            iat: '1685119399',
            username: 'LikeAHurricane'
        },
        resourcePath: '/Bots/List',
        httpMethod: 'GET',
        extendedRequestId: 'FigyPEVZoAMFTYQ=',
        requestTime: '26/May/2023:16:43:19 +0000',
        path: '/Bots/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685119399651,
        requestId: '4353e472-dfee-49b5-8a3a-95097fd00868',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.63.145',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'xy8neixlbc'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any, '' as any);
    console.log(result);
}

main();
