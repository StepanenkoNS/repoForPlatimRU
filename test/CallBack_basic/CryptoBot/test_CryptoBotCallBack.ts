import { handler } from '../../../services/CallBack_basic/CryptoBot/CryptoBotPaymentCallBack';

const event = {
    resource: '/callback/cryptobot',
    path: '/callback/cryptobot',
    httpMethod: 'POST',
    headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=utf-8',
        'crypto-pay-api-signature': 'bd504b6650ef9c10aa0445f1c20a754397e95d9bcd56a1680fa4690fb5c2b984',
        Host: 'payments.zuzona.com',
        'User-Agent': 'axios/0.21.1',
        'X-Amzn-Trace-Id': 'Root=1-64fedd67-57a0f79e13b5a0a146935f2c',
        'X-Forwarded-For': '104.248.195.90',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['application/json, text/plain, */*'],
        'Content-Type': ['application/json;charset=utf-8'],
        'crypto-pay-api-signature': ['bd504b6650ef9c10aa0445f1c20a754397e95d9bcd56a1680fa4690fb5c2b984'],
        Host: ['payments.zuzona.com'],
        'User-Agent': ['axios/0.21.1'],
        'X-Amzn-Trace-Id': ['Root=1-64fedd67-57a0f79e13b5a0a146935f2c'],
        'X-Forwarded-For': ['104.248.195.90'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ydgk2c',
        resourcePath: '/callback/cryptobot',
        httpMethod: 'POST',
        extendedRequestId: 'LFeIMGqWoAMEbIg=',
        requestTime: '11/Sep/2023:09:27:03 +0000',
        path: '/callback/cryptobot',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1694424423343,
        requestId: '74702a0d-a005-4d6c-9eeb-a5e4db72c9a7',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '104.248.195.90',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'axios/0.21.1',
            user: null
        },
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: '{"update_id":22021,"update_type":"invoice_paid","request_date":"2023-09-11T09:27:03.009Z","payload":{"invoice_id":88133,"status":"paid","hash":"IVi0wFTLtCDo","asset":"USDT","amount":"1","fee":"0.03","pay_url":"https://t.me/CryptoTestnetBot?start=IVi0wFTLtCDo","description":"SUBSCRIPTION","created_at":"2023-09-11T08:45:34.419Z","allow_comments":false,"allow_anonymous":true,"expiration_date":"2023-09-11T09:00:34.413Z","usd_rate":"1.00000000","paid_at":"2023-09-11T08:58:19.941Z","paid_anonymously":false,"payload":"{\\"paymentId\\":\\"2VFBQRUJK32S9VorgOyRtT4ltbw\\"}","paid_btn_name":"callback","paid_btn_url":"https://t.me/zuzonabot"}}',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
