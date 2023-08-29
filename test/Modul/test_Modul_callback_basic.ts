import { handler } from '../../services/CallBack_basic/Modul/ModulPaymentCallBack';

const event = {
    resource: '/callback/modul',
    path: '/callback/modul',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'payments.zuzona.com',
        'User-Agent': 'Python/3.6 aiohttp/3.4.4',
        'X-Amzn-Trace-Id': 'Root=1-64edec41-33737fea1002e3663b29acde',
        'X-Forwarded-For': '185.137.76.39',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate'],
        'Content-Type': ['application/x-www-form-urlencoded'],
        Host: ['payments.zuzona.com'],
        'User-Agent': ['Python/3.6 aiohttp/3.4.4'],
        'X-Amzn-Trace-Id': ['Root=1-64edec41-33737fea1002e3663b29acde'],
        'X-Forwarded-For': ['185.137.76.39'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'r15gjg',
        resourcePath: '/callback/modul',
        httpMethod: 'POST',
        extendedRequestId: 'KbHaVGDooAMElzA=',
        requestTime: '29/Aug/2023:13:01:53 +0000',
        path: '/callback/modul',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693314113850,
        requestId: 'eb02d0d6-8c11-49f8-ae42-3fe971821e61',
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
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: 'transaction_id=uQRoEVLlYS3bplHupttPqu&amount=10.00&original_amount=10.00&order_id=2UexsuksoNxGwHIpfyM8aZbUECG&state=COMPLETE&testing=1&pan_mask=513691%2A%2A%2A%2A%2A%2A1434&client_email=stepanenkons%40mail.ru&client_id=199163834&payment_method=card&created_datetime=2023-08-29+13%3A01%3A11&currency=RUB&merchant=c652ef1e-6eb6-41ff-ac1e-99c76a8a03d9&salt=BFF966A730762497A131BF4142CE1758&unix_timestamp=1693314079&signature=c99fd5db2ef28afdeda37f9f59d524aebfe006a5',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
