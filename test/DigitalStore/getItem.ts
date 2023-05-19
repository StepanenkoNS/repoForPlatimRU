import { handler } from 'services/DigitalStore/Item/GetDigitalStoreItemLambda';

const event = {
    resource: '/DigitalStoreItems/List',
    path: '/DigitalStoreItems/List',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        cookie: '_ym_uid=1682772854818099613; _ym_d=1682772854; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHFIRnQ5Nkt4ZHV5NzhwTXkyYjA2UE9IN3QiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMTVUMTk6MDY6MzAuNzg4WiIsIkRGIjoiMjAyNC0wNS0xNFQxOTowNjozMC43ODhaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODQxODQwNDgsImV4cCI6MTcxNTcyMDA0OH0.yo5LKT560T1DU4nlRN7uLc5OE-FFDnAeKecRmC40JVE; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM1WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQ0MzY4NzMsImV4cCI6MTY4NDQzNzE3M30.iWucV1_Enp1cfpfEVFv-XwdVBOk6CCzqTjNmSRTiVUs',
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
        'X-Amzn-Trace-Id': 'Root=1-646677af-1db22e1c1af6d6b825384587',
        'X-Forwarded-For': '176.232.62.243',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        cookie: [
            '_ym_uid=1682772854818099613; _ym_d=1682772854; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHFIRnQ5Nkt4ZHV5NzhwTXkyYjA2UE9IN3QiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMTVUMTk6MDY6MzAuNzg4WiIsIkRGIjoiMjAyNC0wNS0xNFQxOTowNjozMC43ODhaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODQxODQwNDgsImV4cCI6MTcxNTcyMDA0OH0.yo5LKT560T1DU4nlRN7uLc5OE-FFDnAeKecRmC40JVE; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM1WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQ0MzY4NzMsImV4cCI6MTY4NDQzNzE3M30.iWucV1_Enp1cfpfEVFv-XwdVBOk6CCzqTjNmSRTiVUs'
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
        'X-Amzn-Trace-Id': ['Root=1-646677af-1db22e1c1af6d6b825384587'],
        'X-Forwarded-For': ['176.232.62.243'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5795087844', id: 'MLg0iFDUZIVV' },
    multiValueQueryStringParameters: { botId: ['5795087844'], id: ['MLg0iFDUZIVV'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'lv8jr2',
        authorizer: {
            zuzonaSubscription:
                '{"masterId":199163834,"DF":"2024-05-15T08:12:36.434Z","datePaid":"2023-05-16T08:12:36.435Z","subscriptionLevel":1,"subscriptionPlan":"PAIDBOT","currency":"RUB","id":"2Pror5YJxh0C43iqCLg4PtvcHv3","pricePaid":20000,"DS":"2023-05-16T08:12:36.434Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1684437173',
            first_name: 'Nick',
            iat: '1684436873',
            username: 'LikeAHurricane'
        },
        resourcePath: '/DigitalStoreItems/List',
        httpMethod: 'GET',
        extendedRequestId: 'FIejfHbQoAMFunQ=',
        requestTime: '18/May/2023:19:08:31 +0000',
        path: '/DigitalStoreItems/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1684436911645,
        requestId: '48f54b1b-9be8-4935-bed0-bd2c5d89206d',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.62.243',
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
    body: null,
    isBase64Encoded: false
};

async function main() {
    await handler(event as any, {} as any);
}

main();
