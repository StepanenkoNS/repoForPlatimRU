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
        'X-Amzn-Trace-Id': 'Root=1-64773228-00ba12757d0a8c22537ba49d',
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
        'X-Amzn-Trace-Id': ['Root=1-64773228-00ba12757d0a8c22537ba49d'],
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
        extendedRequestId: 'FyTGbHE9oAMF3YA=',
        requestTime: '31/May/2023:11:40:24 +0000',
        path: '/modul_ru/callback',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1685533224853,
        requestId: '5ddd7ac8-aaef-4db2-9a04-14a12d888f50',
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
    body: 'transaction_id=vkuefyJbaxXygEyaxOY1Cd&amount=10000.00&original_amount=10000.00&order_id=2QYawqEjxFT6a9lKVdRNzsbUnJL&state=COMPLETE&testing=1&pan_mask=513691%2A%2A%2A%2A%2A%2A1434&client_email=stepanenkons%40mail.ru&client_id=199163834&payment_method=card&created_datetime=2023-05-31+11%3A40%3A16&currency=RUB&merchant=46e90f0c-76da-4646-81ab-8890763b4316&salt=7028EEB432C5EB8E11EDC4FD2FDDAF3E&unix_timestamp=1685533222&signature=90d89a0bbd3bbf65f8d231375e5fa934af799d87',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
