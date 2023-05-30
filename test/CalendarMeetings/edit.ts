import { handler } from 'services/Meetings/EditMeetingLambda';
const event = {
    resource: '/CalendarMeeting/Edit',
    path: '/CalendarMeeting/Edit',
    httpMethod: 'PUT',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/json',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNS0xNlQwODoxMjozNi40MzRaIiwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NDIzMjg2MSwiZXhwIjoxNzE1NzY4ODYxfQ.55NKZf8ROiNQDe70cmEAcnMaF4eBS5AD1A8tI1Oiijk; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM1WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQ4NTEwMDgsImV4cCI6MTY4NDg1MTMwOH0.v5hcgFWnycgND9-0lAGV3fA5IkrS1SzI8LXp6ha_FuU',
        Host: 'secure-api.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-646ccb22-6d093bfc5e2bb7e355a8e827',
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
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsIkRTIjoiMjAyMy0wNS0xNlQwODoxMjozNi40MzRaIiwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJzdWJzY3JpcHRpb25MZXZlbCI6MX0sImlhdCI6MTY4NDIzMjg2MSwiZXhwIjoxNzE1NzY4ODYxfQ.55NKZf8ROiNQDe70cmEAcnMaF4eBS5AD1A8tI1Oiijk; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE5OTE2MzgzNCwiREYiOiIyMDI0LTA1LTE1VDA4OjEyOjM2LjQzNFoiLCJkYXRlUGFpZCI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM1WiIsInN1YnNjcmlwdGlvbkxldmVsIjoxLCJzdWJzY3JpcHRpb25QbGFuIjoiUEFJREJPVCIsImN1cnJlbmN5IjoiUlVCIiwiaWQiOiIyUHJvcjVZSnhoMEM0M2lxQ0xnNFB0dmNIdjMiLCJwcmljZVBhaWQiOjIwMDAwLCJEUyI6IjIwMjMtMDUtMTZUMDg6MTI6MzYuNDM0WiJ9LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJpYXQiOjE2ODQ4NTEwMDgsImV4cCI6MTY4NDg1MTMwOH0.v5hcgFWnycgND9-0lAGV3fA5IkrS1SzI8LXp6ha_FuU'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-646ccb22-6d093bfc5e2bb7e355a8e827'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'idnhb2',
        authorizer: {
            pomponaSubscription:
                '{"masterId":199163834,"DF":"2024-05-15T08:12:36.434Z","datePaid":"2023-05-16T08:12:36.435Z","subscriptionLevel":1,"subscriptionPlan":"PAIDBOT","currency":"RUB","id":"2Pror5YJxh0C43iqCLg4PtvcHv3","pricePaid":20000,"DS":"2023-05-16T08:12:36.434Z"}',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1684851308',
            first_name: 'Nick',
            iat: '1684851008',
            username: 'LikeAHurricane'
        },
        resourcePath: '/CalendarMeeting/Edit',
        httpMethod: 'PUT',
        extendedRequestId: 'FYStcH2boAMF0Ag=',
        requestTime: '23/May/2023:14:18:10 +0000',
        path: '/CalendarMeeting/Edit',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1684851490565,
        requestId: 'fcf9a37e-8161-4f86-89f6-9f81f1af898a',
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
        domainName: 'secure-api.pompona.net',
        apiId: 'n73jv50gif'
    },
    body: '{"id":"E8SspoqWbH14","masterId":0,"botId":5795087844,"name":"Бесплатный семинар","buttonCaption":"Бесплатный семинар","allDay":true,"format":"ONLINE","participantsLimit":0,"ds":"2023-05-24T21:00:00.000Z","df":"2023-05-25T21:00:00.000Z","prices":[],"enabled":true,"description":"<p>Описание бесплатного семинара</p>\\n","freeEvent":true,"secretAnswer":"<p><strong>фыаывавыфавыфафвыфавыфыв</strong></p>\\n<p>ыфвафываыв</p>\\n","sendOfflineTicket":true}',
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any);
    console.log(result);
}

main();
