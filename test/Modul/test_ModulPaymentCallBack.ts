import { handler } from '../../services/Modul/ModulPaymentCallBack';

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
        'X-Amzn-Trace-Id': 'Root=1-64a3cf46-0f63d1b9403f773e60644053',
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
        'X-Amzn-Trace-Id': ['Root=1-64a3cf46-0f63d1b9403f773e60644053'],
        'X-Forwarded-For': ['185.137.76.39'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'vdvyhb',
        resourcePath: '/modul_ru/callback',
        httpMethod: 'POST',
        extendedRequestId: 'Hh1TGFxqoAMFW9w=',
        requestTime: '04/Jul/2023:07:50:30 +0000',
        path: '/modul_ru/callback',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1688457030704,
        requestId: '04fb9f08-781e-4d59-9db6-a4318ac505a3',
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
        apiId: 'h08z9uckci'
    },
    body: 'transaction_id=rHKDcpW9N2zw0zCfLq5x1w&amount=1000.00&original_amount=1000.00&order_id=2S6B0js2WQ8vOxmTd4oxBuDqxjw&state=COMPLETE&testing=1&pan_mask=513691%2A%2A%2A%2A%2A%2A1434&client_email=stepanenkons%40mail.ru&client_id=199163834&payment_method=card&created_datetime=2023-07-04+07%3A48%3A55&currency=RUB&merchant=46e90f0c-76da-4646-81ab-8890763b4316&salt=C3D3027745D5EA270029A8C485B03FA8&unix_timestamp=1688456940&signature=4e8f7d935feea640e5a390b75993a403909437f6',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
