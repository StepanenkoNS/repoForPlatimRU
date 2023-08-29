import { handler } from '../../services/GetClientPaymentDetails/GetClientPaymentDetails';

const event = {
    resource: '/clientPaymentDetails',
    path: '/clientPaymentDetails',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        Host: 'payments.zuzona.com',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64edfe96-2d69dbaf0feb6d3e3373edbd',
        'X-Forwarded-For': '176.232.61.202',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        Host: ['payments.zuzona.com'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-64edfe96-2d69dbaf0feb6d3e3373edbd'],
        'X-Forwarded-For': ['176.232.61.202'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
        hash: '536c5bae63f0617d60cbffaaa7e4c5909d160629',
        paymentId: '2Uf5lfH4SJI7yEvFkRbE1zXY0Rh'
    },
    multiValueQueryStringParameters: {
        hash: ['536c5bae63f0617d60cbffaaa7e4c5909d160629'],
        paymentId: ['2Uf5lfH4SJI7yEvFkRbE1zXY0Rh']
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'j51uor',
        resourcePath: '/clientPaymentDetails',
        httpMethod: 'GET',
        extendedRequestId: 'KbS3nGr9IAMEvMA=',
        requestTime: '29/Aug/2023:14:20:06 +0000',
        path: '/clientPaymentDetails',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693318806838,
        requestId: 'd960cffb-177e-4953-b38b-f7f2b5aa41ba',
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
