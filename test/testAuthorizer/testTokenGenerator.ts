import { handler } from '../../services/TokenService/Lambdas/lambdaTokenService';

const event = {
    resource: '/getToken',
    path: '/getToken',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW5ndTlNckJsZmFkQ0RMY0ZZeHY3UFo4Y1kiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQxOTo1NjoxOS43MjlaIiwiREYiOiIyMDIzLTA3LTA1VDE5OjU2OjE5LjcyOVoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NTk5NzQ4MywiZXhwIjoxNjg1OTk3NzgzfQ.Ur_ZfLY3k4vY3Fmw6diYsmLydgUnO9pxeomUfJ5Q1IY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW5ndTlNckJsZmFkQ0RMY0ZZeHY3UFo4Y1kiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQxOTo1NjoxOS43MjlaIiwiREYiOiIyMDIzLTA3LTA1VDE5OjU2OjE5LjcyOVoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NTk5NzQ4MywiZXhwIjoxNzE3NTMzNDgzfQ.03v1IA3-Svj-Un-GIWIw5W4_fCCpcIf-coOQIc_RRvg',
        Host: 'auth.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-647e47d7-1a9b663835954386065a4376',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        'content-type': ['application/json'],
        cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW5ndTlNckJsZmFkQ0RMY0ZZeHY3UFo4Y1kiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQxOTo1NjoxOS43MjlaIiwiREYiOiIyMDIzLTA3LTA1VDE5OjU2OjE5LjcyOVoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NTk5NzQ4MywiZXhwIjoxNjg1OTk3NzgzfQ.Ur_ZfLY3k4vY3Fmw6diYsmLydgUnO9pxeomUfJ5Q1IY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW5ndTlNckJsZmFkQ0RMY0ZZeHY3UFo4Y1kiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQxOTo1NjoxOS43MjlaIiwiREYiOiIyMDIzLTA3LTA1VDE5OjU2OjE5LjcyOVoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NTk5NzQ4MywiZXhwIjoxNzE3NTMzNDgzfQ.03v1IA3-Svj-Un-GIWIw5W4_fCCpcIf-coOQIc_RRvg'
        ],
        Host: ['auth.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-647e47d7-1a9b663835954386065a4376'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'b7bro6',
        resourcePath: '/getToken',
        httpMethod: 'POST',
        extendedRequestId: 'GEApsGS1IAMF5Ow=',
        requestTime: '05/Jun/2023:20:38:47 +0000',
        path: '/getToken',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1685997527378,
        requestId: 'c26dd906-9959-48ae-8f70-85fbf51b3e32',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.63.145',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'auth.pompona.net',
        apiId: 'zayyzfynk5'
    },
    body: '{"id":199163834,"first_name":"Nick","photo_url":"https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg","username":"LikeAHurricane","language":"ru","role":"superadmin","pomponaSubscription":{"id":"2Qngu9MrBlfadCDLcFYxv7PZ8cY","subscriptionPlan":"PAIDBOT","DS":"2023-06-05T19:56:19.729Z","DF":"2023-07-05T19:56:19.729Z","subscriptionLevel":1}}',
    isBase64Encoded: false
};

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    const result = await handler(event as any);
    console.log(result);
}

main();

//     },
//     body: '{"id":1862254,"first_name":"Tania","last_name":"Selfreflexia","username":"radiojoy","photo_url":"https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg","auth_date":1682335088,"hash":"820b5ea45b4e46a08428e36cfee6c3636d3268942d1b2231d3f1516f5a20bbd7"}',
//     isBase64Encoded: false
// };
