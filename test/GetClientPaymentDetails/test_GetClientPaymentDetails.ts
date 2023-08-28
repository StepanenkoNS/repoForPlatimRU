import { handler } from '../../services/GetClientPaymentDetails/GetClientPaymentDetails';

const event = {
    resource: '/clientPaymentDetails',
    path: '/clientPaymentDetails',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        Host: 'payments.zuzona.com',
        origin: 'https://payments-ui.zuzona.com',
        referer: 'https://payments-ui.zuzona.com/',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64eb717a-1002694864b925763aafb660',
        'X-Forwarded-For': '176.232.61.202',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        Host: ['payments.zuzona.com'],
        origin: ['https://payments-ui.zuzona.com'],
        referer: ['https://payments-ui.zuzona.com/'],
        'sec-ch-ua': ['"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['same-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-64eb717a-1002694864b925763aafb660'],
        'X-Forwarded-For': ['176.232.61.202'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
        hash: '7f9530165935d813f767d5ae723c6d7dbe8a2ad0',
        paymentId: '2UZebnygrM01PGrHmUNMDwaNE8g'
    },
    multiValueQueryStringParameters: {
        hash: ['7f9530165935d813f767d5ae723c6d7dbe8a2ad0'],
        paymentId: ['2UZebnygrM01PGrHmUNMDwaNE8g']
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'j51uor',
        resourcePath: '/clientPaymentDetails',
        httpMethod: 'GET',
        extendedRequestId: 'KU6rIE91IAMEevA=',
        requestTime: '27/Aug/2023:15:53:30 +0000',
        path: '/clientPaymentDetails',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693151610112,
        requestId: '318fabf1-6b46-41a9-9e12-63fa8392a14a',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.61.202',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
