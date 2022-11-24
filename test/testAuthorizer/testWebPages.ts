import { GetWebPageDataHandler } from 'services/WebPages/GetWebPageData';

const event = {
    resource: '/me',
    path: '/me',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1IiwiaWF0IjoxNjY5MjI1NTQ2LCJleHAiOjE2NjkyMjU2MDZ9.g-eEksC6TGJ0sDPDmTfGlmi2OoIu3TCTUpbb11CvaHk; Expires=Wed, 23 Nov 2022 17:46:46 GMT; Secure; SameSite=None; Domain=.zuzona.com; Path=/; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1IiwiaWF0IjoxNjY5MjI1NTQ2LCJleHAiOjE3MDA3NjE1NDZ9.Y0_rC_9Gsc5KsBt8EC9Wh5rt9YVQ6XOTevxnHbaP058; Expires=Wed, 23 Nov 2022 23:50:46 GMT; Secure; SameSite=None; Domain=.zuzona.com; Path=/',
        Host: 'auth.zuzona.com',
        origin: 'http://localhost',
        referer: 'http://localhost/',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-63769752-04e6a63e2da2792c78d088ab',
        'X-Forwarded-For': '176.232.60.171',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2Njg3MTMxMjIsImV4cCI6MTY2ODcxNjcyMn0.-v5Gq-Uj2W2JJbClK-K-Wm3nqPvUY0xisQmFhvephoY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2Njg3MTMxMjIsImV4cCI6MTcwMDI0OTEyMn0.tEl4LKAUAqbQHdR7GpJjtqqnwascXOfqzCZhEdXEJS4'
        ],
        Host: ['auth.zuzona.com'],
        origin: ['http://localhost'],
        referer: ['http://localhost/'],
        'sec-ch-ua': ['"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-63769752-04e6a63e2da2792c78d088ab'],
        'X-Forwarded-For': ['176.232.60.171'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'cq7j4396rd',
        resourcePath: '/',
        httpMethod: 'POST',
        extendedRequestId: 'bwyU_HdhoAMFf7A=',
        requestTime: '17/Nov/2022:20:19:30 +0000',
        path: '/GetToken',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1668716370975,
        requestId: '3e30936e-72a4-41a7-975b-79961745d89d',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.60.171',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'auth.zuzona.com',
        apiId: 'hr7gpcp5hc'
    },
    body: '{"id":199163834,"first_name":"Nick","username":"LikeAHurricane","auth_date":1668542054,"hash":"20fc7635528bb976f5b5b37792acf12e83f99bc401db5674c075e6327d552f66"}',
    isBase64Encoded: false
};

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    GetWebPageDataHandler(event as any, {} as any);
}

main();
