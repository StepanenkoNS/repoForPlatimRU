import { handler } from '../../services/Yoomoney/YoomoneyPaymentCallBack';

const event = {
    resource: '/yoomoneyRU/callback',
    path: '/yoomoneyRU/callback',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'payments.zuzona.com',
        'User-Agent': 'AHC/2.1',
        'X-Amzn-Trace-Id': 'Root=1-64e8726d-5abf9b3a58c8d9e6508f3473',
        'X-Forwarded-For': '77.75.157.42',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Content-Type': ['application/x-www-form-urlencoded'],
        Host: ['payments.zuzona.com'],
        'User-Agent': ['AHC/2.1'],
        'X-Amzn-Trace-Id': ['Root=1-64e8726d-5abf9b3a58c8d9e6508f3473'],
        'X-Forwarded-For': ['77.75.157.42'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'lno50w',
        resourcePath: '/yoomoneyRU/callback',
        httpMethod: 'POST',
        extendedRequestId: 'KNbRIGGSoAMECxg=',
        requestTime: '25/Aug/2023:09:20:45 +0000',
        path: '/yoomoneyRU/callback',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1692955245328,
        requestId: '2438e2fa-e3ab-4652-9132-fd2920985edd',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '77.75.157.42',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'AHC/2.1',
            user: null
        },
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: 'notification_type=p2p-incoming&bill_id=&amount=644.06&datetime=2023-08-25T09%3A20%3A44Z&codepro=false&sender=41001000040&sha1_hash=86bce1736fe3526614483b298c8716119b2ff912&test_notification=true&operation_label=&operation_id=test-notification&currency=643&label=',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
