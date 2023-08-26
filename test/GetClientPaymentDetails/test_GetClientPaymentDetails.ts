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
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64e9aa82-425d3bc204321fce548e5982',
        'X-Forwarded-For': '176.232.61.202',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
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
        'X-Amzn-Trace-Id': ['Root=1-64e9aa82-425d3bc204321fce548e5982'],
        'X-Forwarded-For': ['176.232.61.202'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: {
        hash: '2UVnqIdRflNM7GAz86RcbGIvFDA',
        paymentId: '2UVnqIdRflNM7GAz86RcbGIvFDA'
    },
    multiValueQueryStringParameters: {
        hash: ['2UVnqIdRflNM7GAz86RcbGIvFDA'],
        paymentId: ['2UVnqIdRflNM7GAz86RcbGIvFDA']
    },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'j51uor',
        resourcePath: '/clientPaymentDetails',
        httpMethod: 'GET',
        extendedRequestId: 'KQeUfF-foAMEh2g=',
        requestTime: '26/Aug/2023:07:32:18 +0000',
        path: '/clientPaymentDetails',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693035138890,
        requestId: 'de2cea9b-2775-494e-a3ef-a50d939d762d',
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
