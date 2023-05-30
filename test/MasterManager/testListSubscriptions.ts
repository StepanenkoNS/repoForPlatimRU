import { ListMasterManagerSubscriptionsHandler } from 'services/MasterManager/ListMasterManagerSubscriptionsLambda';

const event = {
    resource: '/MasterManager/SubscribeToPaidSubscription',
    path: '/MasterManager/SubscribeToPaidSubscription',
    httpMethod: 'PUT',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI1MTk2NTksImV4cCI6MTcxNDA1NTY1OX0.gKz8B95WbkGsZmOIPfSUJ582ptfHFgFiec83yLvAgWg; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI1MTk2NTksImV4cCI6MTY4MjUyMzI1OX0.8Ia5xCdL4-mAebzeWdhQ6DWmQ1Op8WDf7serP088AOY',
        Host: 'secure-api.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-644a40ec-1c99143b7770b8d44f1348f7',
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
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI1MTk2NTksImV4cCI6MTcxNDA1NTY1OX0.gKz8B95WbkGsZmOIPfSUJ582ptfHFgFiec83yLvAgWg; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI1MTk2NTksImV4cCI6MTY4MjUyMzI1OX0.8Ia5xCdL4-mAebzeWdhQ6DWmQ1Op8WDf7serP088AOY'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-644a40ec-1c99143b7770b8d44f1348f7'],
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
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI1MTk2NTksImV4cCI6MTY4MjUyMzI1OX0.8Ia5xCdL4-mAebzeWdhQ6DWmQ1Op8WDf7serP088AOY',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 81,
            id: '199163834',
            first_name: 'Nick',
            iat: '1682519659',
            username: 'LikeAHurricane'
        },
        resourcePath: '/MasterManager/SubscribeToPaidSubscription',
        httpMethod: 'PUT',
        extendedRequestId: 'EB8VDFp5IAMFqeA=',
        requestTime: '27/Apr/2023:09:31:24 +0000',
        path: '/MasterManager/SubscribeToPaidSubscription',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1682587884882,
        requestId: '4fec795e-dd66-4357-a2e4-f61f4a5be2e2',
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
        domainName: 'secure-api.pompona.net',
        apiId: 'we4r6e3su1'
    },
    body: '{"currency":"RUB","lengthInDays":365,"masterId":0,"pricePaid":10000,"subscriptionType":"CHANNEL","subscriptionPlan":"PAID"}',
    isBase64Encoded: false
};

async function main() {
    await ListMasterManagerSubscriptionsHandler(event as any);
}

main();
