import { handler } from 'services/PaymentProcessor/ModulPaymentGenerateData';

const event = {
    resource: '/modul_ru/GeneratePayment',
    path: '/modul_ru/GeneratePayment',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/json',
        cookie: '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW54YnRmY1lic3J3cDhTd21PMmFqVm9pTU8iLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQyMjoxMzo0MS4zMDNaIiwiREYiOiIyMDI0LTA2LTA0VDIyOjEzOjQxLjMwM1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Mn0sImlhdCI6MTY4NjEwNjExMywiZXhwIjoxNzE3NjQyMTEzfQ.EzbIpn02-oObxtYyq4jjmge64YQEeXFCva_k-p6WC8A; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFueGJ0ZmNZYnNyd3A4U3dtTzJhalZvaU1PIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNi0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjEzMjEwMywiZXhwIjoxNjg2MTMyNDAzfQ.o8RRvRXg4NqQWPJzeFDAzsLtTK8l_PTJxUwVGIeAr88',
        Host: 'secure-api.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64805fca-62a7c9201ba3fa2075c73acb',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/json'],
        cookie: [
            '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW54YnRmY1lic3J3cDhTd21PMmFqVm9pTU8iLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQyMjoxMzo0MS4zMDNaIiwiREYiOiIyMDI0LTA2LTA0VDIyOjEzOjQxLjMwM1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Mn0sImlhdCI6MTY4NjEwNjExMywiZXhwIjoxNzE3NjQyMTEzfQ.EzbIpn02-oObxtYyq4jjmge64YQEeXFCva_k-p6WC8A; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFueGJ0ZmNZYnNyd3A4U3dtTzJhalZvaU1PIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNi0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjEzMjEwMywiZXhwIjoxNjg2MTMyNDAzfQ.o8RRvRXg4NqQWPJzeFDAzsLtTK8l_PTJxUwVGIeAr88'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-64805fca-62a7c9201ba3fa2075c73acb'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'b2eseh',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription: '{"id":"2QnxbtfcYbsrwp8SwmO2ajVoiMO","subscriptionPlan":"PAIDBOT","DS":"2023-06-05T22:13:41.303Z","DF":"2024-06-04T22:13:41.303Z","subscriptionLevel":2}',
            integrationLatency: 0,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1686132403',
            first_name: 'Nick',
            iat: '1686132103',
            username: 'LikeAHurricane'
        },
        resourcePath: '/modul_ru/GeneratePayment',
        httpMethod: 'POST',
        extendedRequestId: 'GJPnuF1-oAMF5Yg=',
        requestTime: '07/Jun/2023:10:45:30 +0000',
        path: '/modul_ru/GeneratePayment',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1686134730736,
        requestId: '05cbfe89-52a3-4351-88b9-1672cab84e0e',
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
        domainName: 'secure-api.pompona.net',
        apiId: 'gwzyb9icnh'
    },
    body: '{"currency":"RUB","lengthInDays":30,"masterId":0,"pricePaid":1000,"subscriptionPlan":"BASIC","subscriptionLevel":2}',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
