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
        'X-Amzn-Trace-Id': 'Root=1-64f16e3d-034e897c6d5e3f7a2b0f216d',
        'X-Forwarded-For': '176.232.62.204',
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
        'X-Amzn-Trace-Id': ['Root=1-64f16e3d-034e897c6d5e3f7a2b0f216d'],
        'X-Forwarded-For': ['176.232.62.204'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
        hash: '5fb2b4bb0458d4410620f918530e96d573b68b96',
        paymentId: '2UmTiQEiv7bt8YyeMS8AiXwJ10Z'
    },
    multiValueQueryStringParameters: {
        hash: ['5fb2b4bb0458d4410620f918530e96d573b68b96'],
        paymentId: ['2UmTiQEiv7bt8YyeMS8AiXwJ10Z']
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'j51uor',
        resourcePath: '/clientPaymentDetails',
        httpMethod: 'GET',
        extendedRequestId: 'Kj4pnG_cIAMEQFQ=',
        requestTime: '01/Sep/2023:04:53:17 +0000',
        path: '/clientPaymentDetails',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693543997229,
        requestId: 'b2d82eda-c49a-45fe-81e2-c7615b1ecfb8',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.62.204',
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
