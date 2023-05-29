import { handler } from 'services/Meetings/AddMeetingLambda';
const event = {
    resource: '/CalendarMeeting/Add',
    path: '/CalendarMeeting/Add',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/json',
        cookie: '_ym_uid=1685021017738276214; _ym_d=1685021017; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUU5qSFdJcDZtcWhteXFLNmVKcG9ZcThXNEoiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjdUMTU6MjA6NDUuODgxWiIsIkRGIjoiMjAyNC0wNS0yNlQxNToyMDo0NS44ODFaIn0sImlhdCI6MTY4NTIwMTg0MCwiZXhwIjoxNzE2NzM3ODQwfQ.7zXyzeHNR8KA4fCuk40ZcPoktOHs6gBg6xJ1rcFfPHk; _ym_isad=1; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTI2VDE1OjIwOjQ1Ljg4MVoiLCJpZCI6IjJRTmpIV0lwNm1xaG15cUs2ZUpwb1lxOFc0SiIsImRhdGVQYWlkIjoiMjAyMy0wNS0yN1QxNToyMDo0NS44ODJaIiwic3Vic2NyaXB0aW9uUGxhbiI6IlRSSUFMIiwiRFMiOiIyMDIzLTA1LTI3VDE1OjIwOjQ1Ljg4MVoifSwiZmlyc3RfbmFtZSI6Ik5pY2siLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1MjUzMjM1LCJleHAiOjE2ODUyNTM1MzV9.UUWdKK1JWLOR-FccW2sKAMgicXK8VUej7mmkz6CmCyE',
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
        'X-Amzn-Trace-Id': 'Root=1-6472ed78-502b7103568dbac35e1d4cdf',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/json'],
        cookie: [
            '_ym_uid=1685021017738276214; _ym_d=1685021017; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUU5qSFdJcDZtcWhteXFLNmVKcG9ZcThXNEoiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjdUMTU6MjA6NDUuODgxWiIsIkRGIjoiMjAyNC0wNS0yNlQxNToyMDo0NS44ODFaIn0sImlhdCI6MTY4NTIwMTg0MCwiZXhwIjoxNzE2NzM3ODQwfQ.7zXyzeHNR8KA4fCuk40ZcPoktOHs6gBg6xJ1rcFfPHk; _ym_isad=1; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTI2VDE1OjIwOjQ1Ljg4MVoiLCJpZCI6IjJRTmpIV0lwNm1xaG15cUs2ZUpwb1lxOFc0SiIsImRhdGVQYWlkIjoiMjAyMy0wNS0yN1QxNToyMDo0NS44ODJaIiwic3Vic2NyaXB0aW9uUGxhbiI6IlRSSUFMIiwiRFMiOiIyMDIzLTA1LTI3VDE1OjIwOjQ1Ljg4MVoifSwiZmlyc3RfbmFtZSI6Ik5pY2siLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1MjUzMjM1LCJleHAiOjE2ODUyNTM1MzV9.UUWdKK1JWLOR-FccW2sKAMgicXK8VUej7mmkz6CmCyE'
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
        'X-Amzn-Trace-Id': ['Root=1-6472ed78-502b7103568dbac35e1d4cdf'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'w93zy7',
        authorizer: {
            zuzonaSubscription:
                '{"masterId":199163834,"DF":"2024-05-26T15:20:45.881Z","id":"2QNjHWIp6mqhmyqK6eJpoYq8W4J","datePaid":"2023-05-27T15:20:45.882Z","subscriptionPlan":"TRIAL","DS":"2023-05-27T15:20:45.881Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1685253535',
            first_name: 'Nick',
            iat: '1685253235',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CalendarMeeting/Add',
        httpMethod: 'POST',
        extendedRequestId: 'FnoK5HutoAMFhmA=',
        requestTime: '28/May/2023:05:58:16 +0000',
        path: '/CalendarMeeting/Add',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685253496610,
        requestId: 'bd743ae7-48a8-4966-87eb-b1c571cf2c5a',
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
        apiId: 'lqn0tlx6vf'
    },
    body: '{"id":"","masterId":0,"botId":5795087844,"name":"фываыв","buttonCaption":"фыва","allDay":true,"format":"ONLINE","participantsLimit":0,"ds":"2023-06-01T21:00:00.000Z","df":"2023-06-01T21:00:00.000Z","prices":[],"enabled":true,"description":"<p>фываыв</p>\\n","freeEvent":true,"secretAnswer":"<p>фываыв</p>\\n","sendOfflineTicket":false}',
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any);
    console.log(result);
}

main();
