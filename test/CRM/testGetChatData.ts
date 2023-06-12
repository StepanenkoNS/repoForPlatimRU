import { handler } from 'services/CRM/GetAdminChatMessages';
const event = {
    resource: '/CRM/GetAdminChatMessages',
    path: '/CRM/GetAdminChatMessages',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW51dVFzdzFWOUx3WXUycFRFRjV2R2IxeDQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMjE6NTE6MjguODE0WiIsIkRGIjoiMjAyMy0wNy0wNVQyMTo1MToyOC44MTRaIn0sImlhdCI6MTY4NjAwMzAwOCwiZXhwIjoxNzE3NTM5MDA4fQ.g7DZxj-brBXVLA_g_9jGOLtZH5eWkGqnNV0UJqtvHZU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFzT1Nwdm15MFFVVlZ5WjRGZ29OeEoxdWVhIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNy0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjM5NTA1NiwiZXhwIjoxNjg2Mzk1MzU2fQ.8Mf296S_arUhbybY2Q2q0dlG7rOylD2Z1v5_S-NSLmM',
        Host: 'secure-crm.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-648458b1-7d66d0d93f02cfae318a99bf',
        'X-Forwarded-For': '176.232.62.9',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW51dVFzdzFWOUx3WXUycFRFRjV2R2IxeDQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMjE6NTE6MjguODE0WiIsIkRGIjoiMjAyMy0wNy0wNVQyMTo1MToyOC44MTRaIn0sImlhdCI6MTY4NjAwMzAwOCwiZXhwIjoxNzE3NTM5MDA4fQ.g7DZxj-brBXVLA_g_9jGOLtZH5eWkGqnNV0UJqtvHZU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFzT1Nwdm15MFFVVlZ5WjRGZ29OeEoxdWVhIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNy0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjM5NTA1NiwiZXhwIjoxNjg2Mzk1MzU2fQ.8Mf296S_arUhbybY2Q2q0dlG7rOylD2Z1v5_S-NSLmM'
        ],
        Host: ['secure-crm.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-648458b1-7d66d0d93f02cfae318a99bf'],
        'X-Forwarded-For': ['176.232.62.9'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5645439521', chatId: '199163834' },
    multiValueQueryStringParameters: { botId: ['5645439521'], chatId: ['199163834'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ey8mpf',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription: '{"id":"2QsOSpvmy0QUVVyZ4FgoNxJ1uea","subscriptionPlan":"PAIDBOT","DS":"2023-06-05T22:13:41.303Z","DF":"2024-07-04T22:13:41.303Z","subscriptionLevel":2}',
            integrationLatency: 16,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1686395356',
            first_name: 'Nick',
            iat: '1686395056',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CRM/GetAdminChatMessages',
        httpMethod: 'GET',
        extendedRequestId: 'GTLLtH5soAMF82A=',
        requestTime: '10/Jun/2023:11:04:17 +0000',
        path: '/CRM/GetAdminChatMessages',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-crm',
        requestTimeEpoch: 1686395057063,
        requestId: 'ad235575-4ba1-4ca1-a58b-25a3eb09e395',
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
        domainName: 'secure-crm.pompona.net',
        apiId: '35qjfo0gv5'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any);
    console.log(result);
}

main();
