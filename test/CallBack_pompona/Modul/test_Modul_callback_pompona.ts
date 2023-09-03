import { handler } from '../../../services/CallBack_pompona/Modul/ModulPaymentCallBack';

const event = {
    resource: '/pompona/modul',
    path: '/pompona/modul',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'payments.zuzona.com',
        'User-Agent': 'Python/3.6 aiohttp/3.4.4',
        'X-Amzn-Trace-Id': 'Root=1-64f491f5-5cd5a72654333c2f4c8be7c2',
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
        'X-Amzn-Trace-Id': ['Root=1-64f491f5-5cd5a72654333c2f4c8be7c2'],
        'X-Forwarded-For': ['185.137.76.39'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'x45exl',
        resourcePath: '/pompona/modul',
        httpMethod: 'POST',
        extendedRequestId: 'Kru-bEFFoAMEWZQ=',
        requestTime: '03/Sep/2023:14:02:29 +0000',
        path: '/pompona/modul',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693749749621,
        requestId: '32adce0d-ebc7-448f-b224-2b3994085e64',
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
    body: 'transaction_id=8L6Gwk85We2fbqgMadzzNu&amount=1000.00&original_amount=1000.00&order_id=2UtCTKe8BjDKgWtizERx0WYv3V7&state=COMPLETE&testing=1&pan_mask=513691%2A%2A%2A%2A%2A%2A1434&client_email=stepanenkons%40mail.ru&client_id=199163834&payment_method=card&created_datetime=2023-09-03+13%3A58%3A22&currency=RUB&merchant=c652ef1e-6eb6-41ff-ac1e-99c76a8a03d9&salt=BDCF1D5FFE13FBB7AEB1065036E6D6B0&unix_timestamp=1693749507&signature=efa6dbf802d20cd93423ed63229e24b5b512b358',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
