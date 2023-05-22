import { handler } from 'services/PaymentOptions/DeletePaymentOptionLambda';

const event = {
    resource: '/PaymentOptions/Delete',
    path: '/PaymentOptions/Delete',
    httpMethod: 'DELETE',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/json',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNS0xNlQwODoxMjozNi40MzRaIiwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NDIzMjg2MSwiZXhwIjoxNzE1NzY4ODYxfQ.55NKZf8ROiNQDe70cmEAcnMaF4eBS5AD1A8tI1Oiijk; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM1WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQ2ODMzODMsImV4cCI6MTY4NDY4MzY4M30.VH_NvnZbMk8dk-TbVdPmOyaPYQ-tEXrsdIgr_gpVTSk',
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
        'X-Amzn-Trace-Id': 'Root=1-646a3c55-330966270b06d6cb464f6fe0',
        'X-Forwarded-For': '176.232.62.243',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/json'],
        cookie: [
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNS0xNlQwODoxMjozNi40MzRaIiwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NDIzMjg2MSwiZXhwIjoxNzE1NzY4ODYxfQ.55NKZf8ROiNQDe70cmEAcnMaF4eBS5AD1A8tI1Oiijk; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM1WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQ2ODMzODMsImV4cCI6MTY4NDY4MzY4M30.VH_NvnZbMk8dk-TbVdPmOyaPYQ-tEXrsdIgr_gpVTSk'
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
        'X-Amzn-Trace-Id': ['Root=1-646a3c55-330966270b06d6cb464f6fe0'],
        'X-Forwarded-For': ['176.232.62.243'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'aa8wny',
        authorizer: {
            zuzonaSubscription:
                '{"masterId":199163834,"DF":"2024-05-15T08:12:36.434Z","datePaid":"2023-05-16T08:12:36.435Z","subscriptionLevel":1,"subscriptionPlan":"PAIDBOT","currency":"RUB","id":"2Pror5YJxh0C43iqCLg4PtvcHv3","pricePaid":20000,"DS":"2023-05-16T08:12:36.434Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1684683683',
            first_name: 'Nick',
            iat: '1684683383',
            username: 'LikeAHurricane'
        },
        resourcePath: '/PaymentOptions/Delete',
        httpMethod: 'DELETE',
        extendedRequestId: 'FR5dWFD9IAMFq6g=',
        requestTime: '21/May/2023:15:44:21 +0000',
        path: '/PaymentOptions/Delete',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1684683861147,
        requestId: 'cf23e637-3273-476c-af4b-ce73371decfa',
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
    body: '{"botId":5795087844,"id":"HkjFJ3vPjrt0"}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any, {} as any);
}

main();
