import { handler } from 'services/PaymentOptions/AddPaymentOptionLambda';

const event = {
    resource: '/PaymentOptions/Add',
    path: '/PaymentOptions/Add',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHBwVERmWTVDN3NZWk9pcHhlSE9IZlB6azYiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMTVUMTU6MTg6MDIuMzcxWiIsIkRGIjoiMjAyNC0wNS0xNFQxNToxODowMi4zNzFaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODQxNjM4ODUsImV4cCI6MTcxNTY5OTg4NX0.MOGPqBFA4ugMIqV5T4HSxsvLd0SyZoXBXMvMLk6Wgiw; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE0VDE1OjE4OjAyLjM3MVoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTVUMTU6MTg6MDIuMzcyWiIsInN1YnNjcmlwdGlvbkxldmVsIjowLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJjdXJyZW5jeSI6IlJVQiIsImlkIjoiMlBwcFREZlk1QzdzWVpPaXB4ZUhPSGZQems2IiwicHJpY2VQYWlkIjowLCJEUyI6IjIwMjMtMDUtMTVUMTU6MTg6MDIuMzcxWiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQxNjk5NjgsImV4cCI6MTY4NDE3MDI2OH0.QxPgHLgYX20tko1QQyAXEw8a8YHOF4D1reUvbSwK1Kk',
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
        'X-Amzn-Trace-Id': 'Root=1-64626d2d-38d6a24e2c808147279f9681',
        'X-Forwarded-For': '176.232.61.19',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHBwVERmWTVDN3NZWk9pcHhlSE9IZlB6azYiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMTVUMTU6MTg6MDIuMzcxWiIsIkRGIjoiMjAyNC0wNS0xNFQxNToxODowMi4zNzFaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODQxNjM4ODUsImV4cCI6MTcxNTY5OTg4NX0.MOGPqBFA4ugMIqV5T4HSxsvLd0SyZoXBXMvMLk6Wgiw; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE0VDE1OjE4OjAyLjM3MVoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTVUMTU6MTg6MDIuMzcyWiIsInN1YnNjcmlwdGlvbkxldmVsIjowLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJjdXJyZW5jeSI6IlJVQiIsImlkIjoiMlBwcFREZlk1QzdzWVpPaXB4ZUhPSGZQems2IiwicHJpY2VQYWlkIjowLCJEUyI6IjIwMjMtMDUtMTVUMTU6MTg6MDIuMzcxWiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQxNjk5NjgsImV4cCI6MTY4NDE3MDI2OH0.QxPgHLgYX20tko1QQyAXEw8a8YHOF4D1reUvbSwK1Kk'
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
        'X-Amzn-Trace-Id': ['Root=1-64626d2d-38d6a24e2c808147279f9681'],
        'X-Forwarded-For': ['176.232.61.19'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ntxt80',
        authorizer: {
            zuzonaSubscription:
                '{"masterId":199163834,"DF":"2024-05-14T15:18:02.371Z","datePaid":"2023-05-15T15:18:02.372Z","subscriptionLevel":0,"subscriptionPlan":"TRIAL","currency":"RUB","id":"2PppTDfY5C7sYZOipxeHOHfPzk6","pricePaid":0,"DS":"2023-05-15T15:18:02.371Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1684170268',
            first_name: 'Nick',
            iat: '1684169968',
            username: 'LikeAHurricane'
        },
        resourcePath: '/PaymentOptions/Add',
        httpMethod: 'POST',
        extendedRequestId: 'E-X_KFXvoAMFtpQ=',
        requestTime: '15/May/2023:17:34:37 +0000',
        path: '/PaymentOptions/Add',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1684172077598,
        requestId: '2a0f5e8d-5f67-4ac6-9681-0d9e4f10bb9e',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.61.19',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'n73jv50gif'
    },
    body: '{"botId":5795087844,"discriminator":"IPaymentOptionDirectCardTransfer","type":"DIRECT","currency":"RUB","description":"<p>Переведите деньги на карту Сбербанка <strong>2222 2222 2222 2222 2222</strong> любым удобным вам способом и отправьте скриншот чека в чат.<br>Не забудьте проверить получателя - Иванов Иван Иванович</p>\\n","name":"Сбер"}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any, {} as any);
}

main();
