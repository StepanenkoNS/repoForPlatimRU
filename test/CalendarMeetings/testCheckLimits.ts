import { handler } from 'services/Meetings/CheckAddMeetingSubscriptionLambda';

const event = {
    resource: '/CalendarMeeting/CheckAddMeetingLimit',
    path: '/CalendarMeeting/CheckAddMeetingLimit',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        cookie: '_ym_uid=1685021017738276214; _ym_d=1685021017; _ym_isad=1; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUUxIN3B0aXpXRjFMODJpNXdwT3RjWExNV2kiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjZUMTg6Mjk6MzYuNjUzWiIsIkRGIjoiMjAyNC0wNS0yNVQxODoyOTozNi42NTNaIn0sImlhdCI6MTY4NTEyNzM1NywiZXhwIjoxNjg1MTI3NjU3fQ.iyi8jrK0eH3gkPyy-U2vMnnsh4BodrpNoVqbeBkvCZY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUUxIN3B0aXpXRjFMODJpNXdwT3RjWExNV2kiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjZUMTg6Mjk6MzYuNjUzWiIsIkRGIjoiMjAyNC0wNS0yNVQxODoyOTozNi42NTNaIn0sImlhdCI6MTY4NTEyNzM1NywiZXhwIjoxNzE2NjYzMzU3fQ.Ktf7oS9j7ssLm5efhGrutnxcDz399SLJykN3_96oeCQ',
        Host: 'secure-api.zuzona.com',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-647100dd-4f24c28b0b7077d415ba16ca',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        cookie: [
            '_ym_uid=1685021017738276214; _ym_d=1685021017; _ym_isad=1; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUUxIN3B0aXpXRjFMODJpNXdwT3RjWExNV2kiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjZUMTg6Mjk6MzYuNjUzWiIsIkRGIjoiMjAyNC0wNS0yNVQxODoyOTozNi42NTNaIn0sImlhdCI6MTY4NTEyNzM1NywiZXhwIjoxNjg1MTI3NjU3fQ.iyi8jrK0eH3gkPyy-U2vMnnsh4BodrpNoVqbeBkvCZY; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUUxIN3B0aXpXRjFMODJpNXdwT3RjWExNV2kiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjZUMTg6Mjk6MzYuNjUzWiIsIkRGIjoiMjAyNC0wNS0yNVQxODoyOTozNi42NTNaIn0sImlhdCI6MTY4NTEyNzM1NywiZXhwIjoxNzE2NjYzMzU3fQ.Ktf7oS9j7ssLm5efhGrutnxcDz399SLJykN3_96oeCQ'
        ],
        Host: ['secure-api.zuzona.com'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-647100dd-4f24c28b0b7077d415ba16ca'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '5645439521' },
    multiValueQueryStringParameters: { botId: ['5645439521'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ld5l2f',
        authorizer: {
            zuzonaSubscription: '{"id":"2QLH7ptizWF1L82i5wpOtcXLMWi","subscriptionPlan":"TRIAL","DS":"2023-05-26T18:29:36.653Z","DF":"2024-05-25T18:29:36.653Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1685127657',
            first_name: 'Nick',
            iat: '1685127357',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CalendarMeeting/CheckAddMeetingLimit',
        httpMethod: 'GET',
        extendedRequestId: 'Fi0SoERKoAMFrMQ=',
        requestTime: '26/May/2023:18:56:29 +0000',
        path: '/CalendarMeeting/CheckAddMeetingLimit',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685127389315,
        requestId: '257f6c9b-46c6-4a0f-bf2e-5a636c62a58a',
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
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'xy8neixlbc'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any, '' as any);
    console.log(result);
}

main();
