import { handler } from 'services/SendMessage/SendTestMessageLambda';
const event = {
    resource: '/SendTestMessage/SendTestMessage',
    path: '/SendTestMessage/SendTestMessage',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW51dVFzdzFWOUx3WXUycFRFRjV2R2IxeDQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMjE6NTE6MjguODE0WiIsIkRGIjoiMjAyMy0wNy0wNVQyMTo1MToyOC44MTRaIn0sImlhdCI6MTY4NjAwMzAwOCwiZXhwIjoxNzE3NTM5MDA4fQ.g7DZxj-brBXVLA_g_9jGOLtZH5eWkGqnNV0UJqtvHZU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFzT1Nwdm15MFFVVlZ5WjRGZ29OeEoxdWVhIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNy0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjU0MzQzNSwiZXhwIjoxNjg2NTQzNzM1fQ.Ixqg6_aH44biHDAXD_V2J5weFoxwOt8rAyeA717Mwyk',
        Host: 'secure-api.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64869d4c-071458d65e218b0d616b65f9',
        'X-Forwarded-For': '176.232.62.9',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW51dVFzdzFWOUx3WXUycFRFRjV2R2IxeDQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMjE6NTE6MjguODE0WiIsIkRGIjoiMjAyMy0wNy0wNVQyMTo1MToyOC44MTRaIn0sImlhdCI6MTY4NjAwMzAwOCwiZXhwIjoxNzE3NTM5MDA4fQ.g7DZxj-brBXVLA_g_9jGOLtZH5eWkGqnNV0UJqtvHZU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFzT1Nwdm15MFFVVlZ5WjRGZ29OeEoxdWVhIiwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJEUyI6IjIwMjMtMDYtMDVUMjI6MTM6NDEuMzAzWiIsIkRGIjoiMjAyNC0wNy0wNFQyMjoxMzo0MS4zMDNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjU0MzQzNSwiZXhwIjoxNjg2NTQzNzM1fQ.Ixqg6_aH44biHDAXD_V2J5weFoxwOt8rAyeA717Mwyk'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-64869d4c-071458d65e218b0d616b65f9'],
        'X-Forwarded-For': ['176.232.62.9'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '7bw1z2',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription: '{"id":"2QsOSpvmy0QUVVyZ4FgoNxJ1uea","subscriptionPlan":"PAIDBOT","DS":"2023-06-05T22:13:41.303Z","DF":"2024-07-04T22:13:41.303Z","subscriptionLevel":2}',
            integrationLatency: 0,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1686543735',
            first_name: 'Nick',
            iat: '1686543435',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendTestMessage',
        httpMethod: 'POST',
        extendedRequestId: 'GY2EEE1LIAMF3FA=',
        requestTime: '12/Jun/2023:04:21:32 +0000',
        path: '/SendTestMessage/SendTestMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1686543692924,
        requestId: 'f3a906ea-e909-4843-9af6-6c70758d4718',
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
        domainName: 'secure-api.pompona.net',
        apiId: 'gwzyb9icnh'
    },
    body: '{"botId":5645439521,"message":{"text":"<p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><span>regular</span></p><p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><a href=\\"https://pompona.net\\" rel=\\"noopener\\" class=\\"PlaygroundEditorTheme__link\\"><span>link</span></a></p><p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><b><strong class=\\"PlaygroundEditorTheme__textBold\\">bold</strong></b></p><p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><i><em class=\\"PlaygroundEditorTheme__textItalic\\">italic</em></i></p><p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><u><span class=\\"PlaygroundEditorTheme__textUnderline\\">under</span></u></p><p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><s><span class=\\"PlaygroundEditorTheme__textStrikethrough\\">strike</span></s></p><p class=\\"PlaygroundEditorTheme__paragraph\\" dir=\\"ltr\\"><code><span class=\\"PlaygroundEditorTheme__textCode\\">code</span></code></p>","attachments":[],"sendMethod":"sendMessage"},"interaction":{"type":"NONE"},"contentPlanId":"FREEPLAN","contentPlanPostId":"DRAFT","trigger":{"type":"SCHEDULE_DELAY","delay_minutes":0,"delay_hours":0,"delay_days":0}}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
