import { SubscribeToPaidSubscriptionHandler } from 'services/MasterManager/SubscribeToPaidSubscriptionLambda';

const event = {
    resource: '/MasterManager/SubscribeToPaidSubscription',
    path: '/MasterManager/SubscribeToPaidSubscription',
    httpMethod: 'PUT',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI2MDM1OTMsImV4cCI6MTcxNDEzOTU5M30.FztUED01YbCmiWRK_XxUQ5XkFdP7vPTPY7YoOl5ElGQ; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI2MDM1OTMsImV4cCI6MTY4MjYwNzE5M30.OW4OsoCjd5iA-snwJNH6vGNWylVNJDUZtKuKmpOYVcM',
        Host: 'secure-api.zuzona.com',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-644a8ff1-4aad01cf44a9ee80127a379b',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI2MDM1OTMsImV4cCI6MTcxNDEzOTU5M30.FztUED01YbCmiWRK_XxUQ5XkFdP7vPTPY7YoOl5ElGQ; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI2MDM1OTMsImV4cCI6MTY4MjYwNzE5M30.OW4OsoCjd5iA-snwJNH6vGNWylVNJDUZtKuKmpOYVcM'
        ],
        Host: ['secure-api.zuzona.com'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-644a8ff1-4aad01cf44a9ee80127a379b'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '0l5tgj',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI2MDM1OTMsImV4cCI6MTY4MjYwNzE5M30.OW4OsoCjd5iA-snwJNH6vGNWylVNJDUZtKuKmpOYVcM',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 55,
            id: '199163834',
            first_name: 'Nick',
            iat: '1682603593',
            username: 'LikeAHurricane'
        },
        resourcePath: '/MasterManager/SubscribeToPaidSubscription',
        httpMethod: 'PUT',
        extendedRequestId: 'ECtt1ETwIAMF_Ig=',
        requestTime: '27/Apr/2023:15:08:33 +0000',
        path: '/MasterManager/SubscribeToPaidSubscription',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1682608113856,
        requestId: 'c2806ef7-c8e1-4dd0-8579-54ea0a04983d',
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
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'we4r6e3su1'
    },
    body: '{"currency":"RUB","lengthInDays":30,"masterId":0,"pricePaid":1000,"subscriptionType":"CHANNEL","subscriptionPlan":"PAID"}',
    isBase64Encoded: false
};
async function main() {
    SubscribeToPaidSubscriptionHandler(event as any);
}

main();
