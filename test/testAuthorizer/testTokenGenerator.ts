import { handler } from '../../services/TokenService/Lambdas/lambdaTokenService';

const event = {
    resource: '/getToken',
    path: '/getToken',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUXNPU3B2bXkwUVVWVnlaNEZnb054SjF1ZWEiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQyMjoxMzo0MS4zMDNaIiwiREYiOiIyMDI0LTA3LTA0VDIyOjEzOjQxLjMwM1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Mn0sImlhdCI6MTY4NjMxMTEzOSwiZXhwIjoxNzE3ODQ3MTM5fQ.j7utl-9XCDSqd5bfKyw7Fc2Xbc6PN_6HjHecIaSSeIM; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFzT1Nwdm15MFFVVlZ5WjRGZ29OeEoxdWVhIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNy0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjU1NTMwOCwiZXhwIjoxNjg2NTU1NjA4fQ.LuCc0WYFzgBiKsFpZWOHhe9kaZSzrmVyeD038pVk2No',
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
        'X-Amzn-Trace-Id': 'Root=1-64875122-55e262692a7232936c074782',
        'X-Forwarded-For': '176.232.62.9',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUXNPU3B2bXkwUVVWVnlaNEZnb054SjF1ZWEiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNi0wNVQyMjoxMzo0MS4zMDNaIiwiREYiOiIyMDI0LTA3LTA0VDIyOjEzOjQxLjMwM1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Mn0sImlhdCI6MTY4NjMxMTEzOSwiZXhwIjoxNzE3ODQ3MTM5fQ.j7utl-9XCDSqd5bfKyw7Fc2Xbc6PN_6HjHecIaSSeIM; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFzT1Nwdm15MFFVVlZ5WjRGZ29OeEoxdWVhIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNy0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjU1NTMwOCwiZXhwIjoxNjg2NTU1NjA4fQ.LuCc0WYFzgBiKsFpZWOHhe9kaZSzrmVyeD038pVk2No'
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
        'X-Amzn-Trace-Id': ['Root=1-64875122-55e262692a7232936c074782'],
        'X-Forwarded-For': ['176.232.62.9'],
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
        extendedRequestId: 'GamdZFEyoAMFwqQ=',
        requestTime: '12/Jun/2023:17:08:50 +0000',
        path: '/getToken',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1686589730233,
        requestId: '6d5db45c-0dc1-4b0f-b664-ee6dc3757304',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.62.9',
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
    body: '{"id":199163834,"first_name":"Nick","username":"LikeAHurricane","photo_url":"https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg","auth_date":1685443639,"hash":"de4a3955c6b4c17cd5af53e95ab18beb68210ffa3b2bfca4f1effc55bb6ab640"}',
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
