import { LambdaTokenServiceHandler } from '../../services/TokenService/Lambdas/lambdaTokenService';

const event = {
    resource: '/getToken',
    path: '/getToken',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'accessToken=; refreshToken=',
        Host: 'auth.zuzona.com',
        origin: 'https://admin.zuzona.com',
        referer: 'https://admin.zuzona.com/',
        'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64466571-6da8f29d77d8f6a31fa743b9',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: ['accessToken=; refreshToken='],
        Host: ['auth.zuzona.com'],
        origin: ['https://admin.zuzona.com'],
        referer: ['https://admin.zuzona.com/'],
        'sec-ch-ua': ['"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['same-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-64466571-6da8f29d77d8f6a31fa743b9'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ctx9ur',
        resourcePath: '/getToken',
        httpMethod: 'POST',
        extendedRequestId: 'D4TJtFQ2oAMFvNQ=',
        requestTime: '24/Apr/2023:11:18:09 +0000',
        path: '/getToken',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1682335089036,
        requestId: 'e4509acc-b1c1-4951-b88b-32eac9c4fa20',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.62.238',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'auth.zuzona.com',
        apiId: '8fu0fusfik'
    },
    body: '{    "id": 199163834,"first_name": "Nick","username": "LikeAHurricane","auth_date": 1668542054,"hash": "20fc7635528bb976f5b5b37792acf12e83f99bc401db5674c075e6327d552f66"}',
    isBase64Encoded: false
};

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    LambdaTokenServiceHandler(event as any);
}

main();

//     },
//     body: '{"id":1862254,"first_name":"Tania","last_name":"Selfreflexia","username":"radiojoy","photo_url":"https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg","auth_date":1682335088,"hash":"820b5ea45b4e46a08428e36cfee6c3636d3268942d1b2231d3f1516f5a20bbd7"}',
//     isBase64Encoded: false
// };
