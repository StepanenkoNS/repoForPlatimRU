import { handler } from 'services/Bots/ListBotsLambda';

const event = {
    resource: '/Bots/List',
    path: '/Bots/List',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en;q=0.9',
        cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwiZmlyc3RfbmFtZSI6IlRhbmlhIiwibGFzdF9uYW1lIjoiU2VsZnJlZmxleGlhIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvVVZ1RzNZdnlVU2hudWUzQnVpRFJrSGxIWU1pNlVHQmhjbzZtbXlOUUdCOC5qcGciLCJ1c2VybmFtZSI6InJhZGlvam95IiwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUVlyNnI1Z2xicmlTalNrYno2bTBQT244b2IiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMzFUMTM6NTM6MDMuMTQ4WiIsIkRGIjoiMjAyMy0wNi0zMFQxMzo1MzowMy4xNDhaIn0sImlhdCI6MTY4NTU0MTE4MywiZXhwIjoxNjg1NTQxNDgzfQ.mjtCbnJwpQRzEz9xjh9sqMzglbrgHX4bZS3NtR90UiQ; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwiZmlyc3RfbmFtZSI6IlRhbmlhIiwibGFzdF9uYW1lIjoiU2VsZnJlZmxleGlhIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvVVZ1RzNZdnlVU2hudWUzQnVpRFJrSGxIWU1pNlVHQmhjbzZtbXlOUUdCOC5qcGciLCJ1c2VybmFtZSI6InJhZGlvam95IiwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUVlyNnI1Z2xicmlTalNrYno2bTBQT244b2IiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMzFUMTM6NTM6MDMuMTQ4WiIsIkRGIjoiMjAyMy0wNi0zMFQxMzo1MzowMy4xNDhaIn0sImlhdCI6MTY4NTU0MTE4MywiZXhwIjoxNzE3MDc3MTgzfQ.SW_Gmj7I9GCxIcUa-OgcLLL9uINmq6WmmHYyfL74udI; _ym_d=1685541138; _ym_isad=2; _ym_uid=1685541138991335300; _ym_visorc=w',
        Host: 'secure-api.pompona.net',
        origin: 'https://admin.pompona.net',
        referer: 'https://admin.pompona.net/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'X-Amzn-Trace-Id': 'Root=1-64775199-1d045ae2473955dc3902ad48',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en;q=0.9'],
        cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwiZmlyc3RfbmFtZSI6IlRhbmlhIiwibGFzdF9uYW1lIjoiU2VsZnJlZmxleGlhIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvVVZ1RzNZdnlVU2hudWUzQnVpRFJrSGxIWU1pNlVHQmhjbzZtbXlOUUdCOC5qcGciLCJ1c2VybmFtZSI6InJhZGlvam95IiwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUVlyNnI1Z2xicmlTalNrYno2bTBQT244b2IiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMzFUMTM6NTM6MDMuMTQ4WiIsIkRGIjoiMjAyMy0wNi0zMFQxMzo1MzowMy4xNDhaIn0sImlhdCI6MTY4NTU0MTE4MywiZXhwIjoxNjg1NTQxNDgzfQ.mjtCbnJwpQRzEz9xjh9sqMzglbrgHX4bZS3NtR90UiQ; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg2MjI1NCwiZmlyc3RfbmFtZSI6IlRhbmlhIiwibGFzdF9uYW1lIjoiU2VsZnJlZmxleGlhIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvVVZ1RzNZdnlVU2hudWUzQnVpRFJrSGxIWU1pNlVHQmhjbzZtbXlOUUdCOC5qcGciLCJ1c2VybmFtZSI6InJhZGlvam95IiwibGFuZ3VhZ2UiOiJydSIsInJvbGUiOiJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUVlyNnI1Z2xicmlTalNrYno2bTBQT244b2IiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMzFUMTM6NTM6MDMuMTQ4WiIsIkRGIjoiMjAyMy0wNi0zMFQxMzo1MzowMy4xNDhaIn0sImlhdCI6MTY4NTU0MTE4MywiZXhwIjoxNzE3MDc3MTgzfQ.SW_Gmj7I9GCxIcUa-OgcLLL9uINmq6WmmHYyfL74udI; _ym_d=1685541138; _ym_isad=2; _ym_uid=1685541138991335300; _ym_visorc=w'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['https://admin.pompona.net'],
        referer: ['https://admin.pompona.net/'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['same-site'],
        'User-Agent': ['Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'],
        'X-Amzn-Trace-Id': ['Root=1-64775199-1d045ae2473955dc3902ad48'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '9dt9f5',
        authorizer: {
            role: 'admin',
            last_name: 'Selfreflexia',
            principalId: '1862254',
            language: 'ru',
            pomponaSubscription: '{"id":"2QYr6r5glbriSjSkbz6m0POn8ob","subscriptionPlan":"TRIAL","DS":"2023-05-31T13:53:03.148Z","DF":"2023-06-30T13:53:03.148Z"}',
            integrationLatency: 0,
            id: '1862254',
            photo_url: 'https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg',
            exp: '1685541483',
            first_name: 'Tania',
            iat: '1685541183',
            username: 'radiojoy'
        },
        resourcePath: '/Bots/List',
        httpMethod: 'GET',
        extendedRequestId: 'Fymv-FF2IAMFlKg=',
        requestTime: '31/May/2023:13:54:33 +0000',
        path: '/Bots/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685541273143,
        requestId: 'cdea60a3-03a3-4c94-ba41-369b7d2f797a',
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
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
            user: null
        },
        domainName: 'secure-api.pompona.net',
        apiId: 'nvgz27hiu8'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
