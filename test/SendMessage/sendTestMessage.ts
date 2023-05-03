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
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI3NTMwMjgsImV4cCI6MTcxNDI4OTAyOH0.HFyeOAyRCKQRnaDn7zQCz7rb49EO66r0H3c_4wwIayg; _ym_uid=1682772854818099613; _ym_d=1682772854; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzMDg4Njg4LCJleHAiOjE2ODMwOTIyODh9.w6QIphsqALr0ZN89Lk0RZdozotjn1dr0vwSKLHB0nok',
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
        'X-Amzn-Trace-Id': 'Root=1-6451efc9-5c6b6a2325bdc9650acf85d3',
        'X-Forwarded-For': '176.232.60.170',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en-US;q=0.9,en;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODI3NTMwMjgsImV4cCI6MTcxNDI4OTAyOH0.HFyeOAyRCKQRnaDn7zQCz7rb49EO66r0H3c_4wwIayg; _ym_uid=1682772854818099613; _ym_d=1682772854; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzMDg4Njg4LCJleHAiOjE2ODMwOTIyODh9.w6QIphsqALr0ZN89Lk0RZdozotjn1dr0vwSKLHB0nok'
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
        'X-Amzn-Trace-Id': ['Root=1-6451efc9-5c6b6a2325bdc9650acf85d3'],
        'X-Forwarded-For': ['176.232.60.170'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'vd9l44',
        authorizer: {
            principalId: '199163834',
            integrationLatency: 0,
            id: '199163834',
            exp: '1683092288',
            iat: '1683088688',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendTestMessage',
        httpMethod: 'POST',
        extendedRequestId: 'EVJngHWkoAMFuUA=',
        requestTime: '03/May/2023:05:23:21 +0000',
        path: '/SendTestMessage/SendTestMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1683091401377,
        requestId: '20668582-c54a-445e-b07f-60bbdc155533',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.60.170',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'u1y1q3vcq6'
    },
    body: '{"botId":5795087844,"sendMethod":"sendPhoto","message":{"text":"<p>asdfadsfsd</p>\\n","attachments":[{"discriminator":"ITelegramFile","id":"AgACAgIAAxkBAAIIzWRRRBA_gY30uPUwtbaHwXdnTLOGAAKxyDEbEoKJSgf4FH4SQSI3AQADAgADeQADLwQ","botId":5795087844,"masterId":199163834,"name":"2023-05-02T17:10:40.822Z","mediaType":"PHOTO","fileSize":205322,"tags":[],"createdAt":"2023-05-02T17:10:40.822Z","updatedAt":"2023-05-02T17:10:40.822Z"}]},"interaction":{"type":"RATE","rateOptions":"YN"},"contentPlanId":"FREEPLAN","contentPlanPostId":"DRAFT"}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any, '' as any);
}

main();
