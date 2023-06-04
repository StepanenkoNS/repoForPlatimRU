import { handler } from 'services/TelegramFiles/ListTelegramFilesLambda';
const event = {
    resource: '/TelegramFiles/List',
    path: '/TelegramFiles/List',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUWI3SldOWklyR2FQM0M3Tk4zWmtuMTh6TU0iLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDFUMDk6MDU6NTUuMjAxWiIsIkRGIjoiMjAyMy0wNy0wMVQwOTowNTo1NS4yMDFaIn0sImlhdCI6MTY4NTYxMTI0MiwiZXhwIjoxNzE3MTQ3MjQyfQ.fnUqN8-FaaI5Vf0myHL9hkF4U7w9YHh3Dk_PTbWDumM; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7Im1hc3RlcklkIjoxOTkxNjM4MzQsIkRGIjoiMjAyNC0wNi0wMVQxODoxNTo1MC44ODJaIiwiZGF0ZVBhaWQiOiIyMDIzLTA2LTAyVDE4OjE1OjUwLjg4M1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Miwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJjdXJyZW5jeSI6IlJVQiIsImlkIjoiMlFmMUpkRHY0dDk3dDF3WXl0Y2ptaEhSMnI5IiwicHJpY2VQYWlkIjo0MDAwMCwiRFMiOiIyMDIzLTA2LTAyVDE4OjE1OjUwLjg4MloifSwiZmlyc3RfbmFtZSI6Ik5pY2siLCJwaG90b191cmwiOiJodHRwczovL3QubWUvaS91c2VycGljLzMyMC9Eb1FBZ0U4cUllVVRZTnVuel9td3hYWmN3dU9iRmJjZEROWFllSUtSQlJvLmpwZyIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODU4MDYyMTYsImV4cCI6MTY4NTgwNjUxNn0.3Q_dZ4TdWNY1WqIoXzgZc3LbZxBR7aFz-Del8JBuwbE',
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
        'X-Amzn-Trace-Id': 'Root=1-647b5d02-288f6adc559b85542bfa7e54',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUWI3SldOWklyR2FQM0M3Tk4zWmtuMTh6TU0iLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDFUMDk6MDU6NTUuMjAxWiIsIkRGIjoiMjAyMy0wNy0wMVQwOTowNTo1NS4yMDFaIn0sImlhdCI6MTY4NTYxMTI0MiwiZXhwIjoxNzE3MTQ3MjQyfQ.fnUqN8-FaaI5Vf0myHL9hkF4U7w9YHh3Dk_PTbWDumM; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7Im1hc3RlcklkIjoxOTkxNjM4MzQsIkRGIjoiMjAyNC0wNi0wMVQxODoxNTo1MC44ODJaIiwiZGF0ZVBhaWQiOiIyMDIzLTA2LTAyVDE4OjE1OjUwLjg4M1oiLCJzdWJzY3JpcHRpb25MZXZlbCI6Miwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJjdXJyZW5jeSI6IlJVQiIsImlkIjoiMlFmMUpkRHY0dDk3dDF3WXl0Y2ptaEhSMnI5IiwicHJpY2VQYWlkIjo0MDAwMCwiRFMiOiIyMDIzLTA2LTAyVDE4OjE1OjUwLjg4MloifSwiZmlyc3RfbmFtZSI6Ik5pY2siLCJwaG90b191cmwiOiJodHRwczovL3QubWUvaS91c2VycGljLzMyMC9Eb1FBZ0U4cUllVVRZTnVuel9td3hYWmN3dU9iRmJjZEROWFllSUtSQlJvLmpwZyIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODU4MDYyMTYsImV4cCI6MTY4NTgwNjUxNn0.3Q_dZ4TdWNY1WqIoXzgZc3LbZxBR7aFz-Del8JBuwbE'
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
        'X-Amzn-Trace-Id': ['Root=1-647b5d02-288f6adc559b85542bfa7e54'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5944896623', tags: '' },
    multiValueQueryStringParameters: { botId: ['5944896623'], tags: [''] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ez1bre',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription:
                '{"masterId":199163834,"DF":"2024-06-01T18:15:50.882Z","datePaid":"2023-06-02T18:15:50.883Z","subscriptionLevel":2,"subscriptionPlan":"PAIDBOT","currency":"RUB","id":"2Qf1JdDv4t97t1wYytcjmhHR2r9","pricePaid":40000,"DS":"2023-06-02T18:15:50.882Z"}',
            integrationLatency: 0,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1685806516',
            first_name: 'Nick',
            iat: '1685806216',
            username: 'LikeAHurricane'
        },
        resourcePath: '/TelegramFiles/List',
        httpMethod: 'GET',
        extendedRequestId: 'F8t4gEJ1IAMFhLg=',
        requestTime: '03/Jun/2023:15:32:18 +0000',
        path: '/TelegramFiles/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685806338939,
        requestId: '427501da-2015-4f52-af3e-34f80f23dc7c',
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
        domainName: 'secure-api.pompona.net',
        apiId: 'h5g0x3khg4'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
