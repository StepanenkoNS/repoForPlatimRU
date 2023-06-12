import { handler } from 'services/SendMessage/SendDirectMessageFromAdminLambda';
const event = {
    resource: '/SendTestMessage/SendDirectMessage',
    path: '/SendTestMessage/SendDirectMessage',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW51dVFzdzFWOUx3WXUycFRFRjV2R2IxeDQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMjE6NTE6MjguODE0WiIsIkRGIjoiMjAyMy0wNy0wNVQyMTo1MToyOC44MTRaIn0sImlhdCI6MTY4NjAwMzAwOCwiZXhwIjoxNzE3NTM5MDA4fQ.g7DZxj-brBXVLA_g_9jGOLtZH5eWkGqnNV0UJqtvHZU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFudXVRc3cxVjlMd1l1MnBURUY1dkdiMXg0Iiwic3Vic2NyaXB0aW9uUGxhbiI6IlRSSUFMIiwiRFMiOiIyMDIzLTA2LTA1VDIxOjUxOjI4LjgxNFoiLCJERiI6IjIwMjMtMDctMDVUMjE6NTE6MjguODE0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjM5MzgyMCwiZXhwIjoxNjg2Mzk0MTIwfQ.TVYK4Dkn_e7wXhcsvKKlTVg7ZjK_qsNr2jtglMn8iG0',
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
        'X-Amzn-Trace-Id': 'Root=1-64845db9-1a2d629454159a110686782d',
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
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW51dVFzdzFWOUx3WXUycFRFRjV2R2IxeDQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMjE6NTE6MjguODE0WiIsIkRGIjoiMjAyMy0wNy0wNVQyMTo1MToyOC44MTRaIn0sImlhdCI6MTY4NjAwMzAwOCwiZXhwIjoxNzE3NTM5MDA4fQ.g7DZxj-brBXVLA_g_9jGOLtZH5eWkGqnNV0UJqtvHZU; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7ImlkIjoiMlFudXVRc3cxVjlMd1l1MnBURUY1dkdiMXg0Iiwic3Vic2NyaXB0aW9uUGxhbiI6IlRSSUFMIiwiRFMiOiIyMDIzLTA2LTA1VDIxOjUxOjI4LjgxNFoiLCJERiI6IjIwMjMtMDctMDVUMjE6NTE6MjguODE0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImlhdCI6MTY4NjM5MzgyMCwiZXhwIjoxNjg2Mzk0MTIwfQ.TVYK4Dkn_e7wXhcsvKKlTVg7ZjK_qsNr2jtglMn8iG0'
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
        'X-Amzn-Trace-Id': ['Root=1-64845db9-1a2d629454159a110686782d'],
        'X-Forwarded-For': ['176.232.62.9'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'u42nip',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription: '{"id":"2QnuuQsw1V9LwYu2pTEF5vGb1x4","subscriptionPlan":"TRIAL","DS":"2023-06-05T21:51:28.814Z","DF":"2023-07-05T21:51:28.814Z"}',
            integrationLatency: 0,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1686394120',
            first_name: 'Nick',
            iat: '1686393820',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendDirectMessage',
        httpMethod: 'POST',
        extendedRequestId: 'GTOVBHzMIAMFWfg=',
        requestTime: '10/Jun/2023:11:25:45 +0000',
        path: '/SendTestMessage/SendDirectMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1686396345471,
        requestId: 'e99438c7-0aa8-4835-baa5-83c58b6fb943',
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
    body: '{"botId":5645439521,"chatId":199163834,"message":{"text":"<b><strong>affadsfsd</strong></b>\\nasdfasdfads\\n","attachments":[],"sendMethod":"sendMessage"},"replyToTelegramMessageId":1110,"userFeedBackId":"2R00n2prtUX9eADwXTNhGBnr4rX","answeredMessageType":"FEEDBACK_GENERAL"}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
