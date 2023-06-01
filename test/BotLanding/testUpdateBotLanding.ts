import { handler } from 'services/BotLanding/UpdateBotLanding';

const event = {
    resource: '/Landing',
    path: '/Landing',
    httpMethod: 'PUT',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'content-type': 'application/json',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwiZmlyc3RfbmFtZSI6IlRhbmlhIiwibGFzdF9uYW1lIjoiU2VsZnJlZmxleGlhIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvVVZ1RzNZdnlVU2hudWUzQnVpRFJrSGxIWU1pNlVHQmhjbzZtbXlOUUdCOC5qcGciLCJ1c2VybmFtZSI6InJhZGlvam95IiwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUVlyNnI1Z2xicmlTalNrYno2bTBQT244b2IiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMzFUMTM6NTM6MDMuMTQ4WiIsIkRGIjoiMjAyMy0wNi0zMFQxMzo1MzowMy4xNDhaIn0sImlhdCI6MTY4NTU0Mzk5NiwiZXhwIjoxNzE3MDc5OTk2fQ.3SzMIdtX3I2vf346RYf8w9QoLvO8mXds1FUJtDlBg5k; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE4NjIyNTQsIkRGIjoiMjAyMy0wNi0zMFQxNTozNzozOC42NDhaIiwiZGF0ZVBhaWQiOiIyMDIzLTA1LTMxVDE1OjM3OjM4LjY0OFoiLCJzdWJzY3JpcHRpb25MZXZlbCI6Miwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJjdXJyZW5jeSI6IlJVQiIsImlkIjoiMlFaM3BPZkxialpHUk51cGpUU2Zia21SenpYIiwicHJpY2VQYWlkIjoyMDAwLCJEUyI6IjIwMjMtMDUtMzFUMTU6Mzc6MzguNjQ4WiJ9LCJmaXJzdF9uYW1lIjoiVGFuaWEiLCJsYXN0X25hbWUiOiJTZWxmcmVmbGV4aWEiLCJwaG90b191cmwiOiJodHRwczovL3QubWUvaS91c2VycGljLzMyMC9VVnVHM1l2eVVTaG51ZTNCdWlEUmtIbEhZTWk2VUdCaGNvNm1teU5RR0I4LmpwZyIsInVzZXJuYW1lIjoicmFkaW9qb3kiLCJpYXQiOjE2ODU1OTY4NjksImV4cCI6MTY4NTU5NzE2OX0.4aK6W9CN_hILe8-C4NVLtSS4-3XZeHCYiISSP_xoXos',
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
        'X-Amzn-Trace-Id': 'Root=1-64782ace-04645ef42e47ccb41e1885a4',
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
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwiZmlyc3RfbmFtZSI6IlRhbmlhIiwibGFzdF9uYW1lIjoiU2VsZnJlZmxleGlhIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvVVZ1RzNZdnlVU2hudWUzQnVpRFJrSGxIWU1pNlVHQmhjbzZtbXlOUUdCOC5qcGciLCJ1c2VybmFtZSI6InJhZGlvam95IiwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUVlyNnI1Z2xicmlTalNrYno2bTBQT244b2IiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMzFUMTM6NTM6MDMuMTQ4WiIsIkRGIjoiMjAyMy0wNi0zMFQxMzo1MzowMy4xNDhaIn0sImlhdCI6MTY4NTU0Mzk5NiwiZXhwIjoxNzE3MDc5OTk2fQ.3SzMIdtX3I2vf346RYf8w9QoLvO8mXds1FUJtDlBg5k; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsibWFzdGVySWQiOjE4NjIyNTQsIkRGIjoiMjAyMy0wNi0zMFQxNTozNzozOC42NDhaIiwiZGF0ZVBhaWQiOiIyMDIzLTA1LTMxVDE1OjM3OjM4LjY0OFoiLCJzdWJzY3JpcHRpb25MZXZlbCI6Miwic3Vic2NyaXB0aW9uUGxhbiI6IlBBSURCT1QiLCJjdXJyZW5jeSI6IlJVQiIsImlkIjoiMlFaM3BPZkxialpHUk51cGpUU2Zia21SenpYIiwicHJpY2VQYWlkIjoyMDAwLCJEUyI6IjIwMjMtMDUtMzFUMTU6Mzc6MzguNjQ4WiJ9LCJmaXJzdF9uYW1lIjoiVGFuaWEiLCJsYXN0X25hbWUiOiJTZWxmcmVmbGV4aWEiLCJwaG90b191cmwiOiJodHRwczovL3QubWUvaS91c2VycGljLzMyMC9VVnVHM1l2eVVTaG51ZTNCdWlEUmtIbEhZTWk2VUdCaGNvNm1teU5RR0I4LmpwZyIsInVzZXJuYW1lIjoicmFkaW9qb3kiLCJpYXQiOjE2ODU1OTY4NjksImV4cCI6MTY4NTU5NzE2OX0.4aK6W9CN_hILe8-C4NVLtSS4-3XZeHCYiISSP_xoXos'
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
        'X-Amzn-Trace-Id': ['Root=1-64782ace-04645ef42e47ccb41e1885a4'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'ekw6nx',
        authorizer: {
            role: 'admin',
            last_name: 'Selfreflexia',
            principalId: '1862254',
            language: 'ru',
            pomponaSubscription:
                '{"masterId":1862254,"DF":"2023-06-30T15:37:38.648Z","datePaid":"2023-05-31T15:37:38.648Z","subscriptionLevel":2,"subscriptionPlan":"PAIDBOT","currency":"RUB","id":"2QZ3pOfLbjZGRNupjTSfbkmRzzX","pricePaid":2000,"DS":"2023-05-31T15:37:38.648Z"}',
            integrationLatency: 84,
            id: '1862254',
            photo_url: 'https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg',
            exp: '1685597169',
            first_name: 'Tania',
            iat: '1685596869',
            username: 'radiojoy'
        },
        resourcePath: '/Landing',
        httpMethod: 'PUT',
        extendedRequestId: 'F0ugYHrdoAMFSEw=',
        requestTime: '01/Jun/2023:05:21:18 +0000',
        path: '/Landing',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685596878917,
        requestId: '5ee61fac-0666-450a-9f79-458acc8f485b',
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
        apiId: 'nvgz27hiu8'
    },
    body: '{"masterId":1862254,"title":"","elements":[{"text":"","type":"HEADER"}],"botId":5645439521,"subdomain":"zuzonabot"}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
