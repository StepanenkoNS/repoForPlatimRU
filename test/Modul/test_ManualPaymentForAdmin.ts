import { handler } from '../../services/CallBack_pompona/Modul/ModulPaymentCallBack';

const event = {
    resource: '/modulRu/callback',
    path: '/modulRu/callback',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'payments.pompona.net',
        'User-Agent': 'Python/3.6 aiohttp/3.4.4',
        'X-Amzn-Trace-Id': 'Root=1-64a51754-398ce3013d9618c807006c49',
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
        'X-Amzn-Trace-Id': ['Root=1-64a51754-398ce3013d9618c807006c49'],
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
        resourcePath: '/modulRu/callback',
        httpMethod: 'POST',
        extendedRequestId: 'HlCVNE2EIAMFe1g=',
        requestTime: '05/Jul/2023:07:10:12 +0000',
        path: '/modulRu/callback',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1688541012210,
        requestId: 'db94bbf4-8f4c-42a1-8109-4dd68a88b6a7',
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
    body: 'transaction_id=iOHDW73pGHQ8y5dyP5DISp&amount=5000.00&original_amount=5000.00&order_id=2S8uvBAnNFmv6thWgfMdgEWnheg&state=COMPLETE&testing=1&pan_mask=513691%2A%2A%2A%2A%2A%2A1434&client_email=stepanenkons%40mail.ru&client_id=199163834&payment_method=card&created_datetime=2023-07-05+07%3A06%3A06&currency=RUB&merchant=46e90f0c-76da-4646-81ab-8890763b4316&salt=69262AB725165A7B4172708390CBC6A5&unix_timestamp=1688540774&signature=239c42b12e98140c71d77bdecfcf92bcd11b09c0',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
