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
        cookie: '_ym_uid=1682772854818099613; _ym_d=1682772854; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUU5qSFdJcDZtcWhteXFLNmVKcG9ZcThXNEoiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjdUMTU6MjA6NDUuODgxWiIsIkRGIjoiMjAyNC0wNS0yNlQxNToyMDo0NS44ODFaIn0sImlhdCI6MTY4NTIwMDg3NywiZXhwIjoxNzE2NzM2ODc3fQ.pxtmjgLWg0QWn_WgQlp7nEO4peUbc7l9YbBT3x4Cjlc; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTI2VDE1OjIwOjQ1Ljg4MVoiLCJpZCI6IjJRTmpIV0lwNm1xaG15cUs2ZUpwb1lxOFc0SiIsImRhdGVQYWlkIjoiMjAyMy0wNS0yN1QxNToyMDo0NS44ODJaIiwic3Vic2NyaXB0aW9uUGxhbiI6IlRSSUFMIiwiRFMiOiIyMDIzLTA1LTI3VDE1OjIwOjQ1Ljg4MVoifSwiZmlyc3RfbmFtZSI6Ik5pY2siLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1MzUxNDY3LCJleHAiOjE2ODUzNTE3Njd9.K6rUi0eVA1XTtWjco0wD4DQVzqXr7inNVPMU2iIRUmc',
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
        'X-Amzn-Trace-Id': 'Root=1-64746d4b-3374ea8332d324ba32220ac9',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            '_ym_uid=1682772854818099613; _ym_d=1682772854; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUU5qSFdJcDZtcWhteXFLNmVKcG9ZcThXNEoiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMjdUMTU6MjA6NDUuODgxWiIsIkRGIjoiMjAyNC0wNS0yNlQxNToyMDo0NS44ODFaIn0sImlhdCI6MTY4NTIwMDg3NywiZXhwIjoxNzE2NzM2ODc3fQ.pxtmjgLWg0QWn_WgQlp7nEO4peUbc7l9YbBT3x4Cjlc; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTI2VDE1OjIwOjQ1Ljg4MVoiLCJpZCI6IjJRTmpIV0lwNm1xaG15cUs2ZUpwb1lxOFc0SiIsImRhdGVQYWlkIjoiMjAyMy0wNS0yN1QxNToyMDo0NS44ODJaIiwic3Vic2NyaXB0aW9uUGxhbiI6IlRSSUFMIiwiRFMiOiIyMDIzLTA1LTI3VDE1OjIwOjQ1Ljg4MVoifSwiZmlyc3RfbmFtZSI6Ik5pY2siLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1MzUxNDY3LCJleHAiOjE2ODUzNTE3Njd9.K6rUi0eVA1XTtWjco0wD4DQVzqXr7inNVPMU2iIRUmc'
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
        'X-Amzn-Trace-Id': ['Root=1-64746d4b-3374ea8332d324ba32220ac9'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'iek9g8',
        authorizer: {
            zuzonaSubscription:
                '{"masterId":199163834,"DF":"2024-05-26T15:20:45.881Z","id":"2QNjHWIp6mqhmyqK6eJpoYq8W4J","datePaid":"2023-05-27T15:20:45.882Z","subscriptionPlan":"TRIAL","DS":"2023-05-27T15:20:45.881Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1685351767',
            first_name: 'Nick',
            iat: '1685351467',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendTestMessage',
        httpMethod: 'POST',
        extendedRequestId: 'FrYD0HdNIAMFpgw=',
        requestTime: '29/May/2023:09:15:55 +0000',
        path: '/SendTestMessage/SendTestMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685351755398,
        requestId: '4589d53b-cfe1-4064-9cb7-d38ee53fe35f',
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
    body: '{"botId":5795087844,"message":{"text":"<p>asdfsadfads</p>\\n","attachments":[],"sendMethod":"sendMessage"},"interaction":{"type":"REQUESTPAY","DigitalStoreItemId":"{\\"digitalStoreCategoryId\\":\\"oH9TW2-UsIO-\\",\\"digitalStoreItemId\\":\\"wzXs8f6r5R88\\"}","buttonCaption":"asdfadsadfsad","DigitalStoreCategoryId":"oH9TW2-UsIO-"},"contentPlanId":"FREEPLAN","contentPlanPostId":"DRAFT","trigger":{"type":"SCHEDULE_DELAY","delay_days":0,"delay_hours":0,"delay_minutes":0}}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any, '' as any);
}

main();
