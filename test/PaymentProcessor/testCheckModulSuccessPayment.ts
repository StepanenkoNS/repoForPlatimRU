import { handler } from 'services/PaymentProcessor/ModulPaymentCallBack';

const event = {
    resource: '/modul_ru/callback',
    path: '/modul_ru/callback',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'payments.pompona.net',
        'User-Agent': 'Python/3.6 aiohttp/3.4.4',
        'X-Amzn-Trace-Id': 'Root=1-647764c3-2b32ba1968b95b361d49b32e',
        'X-Forwarded-For': '185.137.76.39',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate'],
        'Content-Type': ['application/x-www-form-urlencoded'],
        Host: ['payments.pompona.net'],
        'User-Agent': ['Python/3.6 aiohttp/3.4.4'],
        'X-Amzn-Trace-Id': ['Root=1-647764c3-2b32ba1968b95b361d49b32e'],
        'X-Forwarded-For': ['185.137.76.39'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'jppaqc',
        resourcePath: '/modul_ru/callback',
        httpMethod: 'POST',
        extendedRequestId: 'FyyupGP0IAMFWbQ=',
        requestTime: '31/May/2023:15:16:19 +0000',
        path: '/modul_ru/callback',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1685546179882,
        requestId: '87d45138-636c-41a9-930a-84874d1d7acf',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '185.137.76.39',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Python/3.6 aiohttp/3.4.4',
            user: null
        },
        domainName: 'payments.pompona.net',
        apiId: 'sutkxdzpkc'
    },
    body: 'transaction_id=gGnCbiIwA95oaEJDgs92fZ&amount=10000.00&original_amount=10000.00&order_id=2QZ17eTxHQJDcyCrDf1vK13byT4&state=COMPLETE&testing=1&pan_mask=513691%2A%2A%2A%2A%2A%2A1434&client_email=stepanenkons%40mail.ru&client_id=1862254&payment_method=card&created_datetime=2023-05-31+15%3A15%3A33&currency=RUB&merchant=46e90f0c-76da-4646-81ab-8890763b4316&salt=CE7DDFE8C1F16F1540C651EF60A2F5E0&unix_timestamp=1685546146&signature=b97d9f66f8f47de0376a02ea257665a69cfa6497',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
