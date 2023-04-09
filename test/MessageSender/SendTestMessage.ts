import { SendTestMessageHandler } from 'services/SendMessage/SendTestMessageLambda';
const event = {
    resource: '/SendTestMessage/SendTestMessage',
    path: '/SendTestMessage/SendTestMessage',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDgzODIsImV4cCI6MTcxMTc4NDM4Mn0.R_whTnW_K-Pfa3EdOLcxRLdI9HriPMAdqDXlbuj6440; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDgzODIsImV4cCI6MTY4MDI1MTk4Mn0.rt4Yy9MFQ3Xc5ZTGHwKGQXNM1Ve_fWyRwJzMSK_432E',
        Host: 'secure-api.zuzona.com',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-6426cef2-2a1608695a81ed640d3aa92e',
        'X-Forwarded-For': '176.232.62.238',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDgzODIsImV4cCI6MTcxMTc4NDM4Mn0.R_whTnW_K-Pfa3EdOLcxRLdI9HriPMAdqDXlbuj6440; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDgzODIsImV4cCI6MTY4MDI1MTk4Mn0.rt4Yy9MFQ3Xc5ZTGHwKGQXNM1Ve_fWyRwJzMSK_432E'
        ],
        Host: ['secure-api.zuzona.com'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-6426cef2-2a1608695a81ed640d3aa92e'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'wbvdhx',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODAyNDgzODIsImV4cCI6MTY4MDI1MTk4Mn0.rt4Yy9MFQ3Xc5ZTGHwKGQXNM1Ve_fWyRwJzMSK_432E',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 528,
            id: '199163834',
            first_name: 'Nick',
            iat: '1680248382',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendTestMessage',
        httpMethod: 'POST',
        extendedRequestId: 'CpVF3GOUIAMFo2Q=',
        requestTime: '31/Mar/2023:12:15:46 +0000',
        path: '/SendTestMessage/SendTestMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1680264946006,
        requestId: 'd03e9eac-8a97-489c-9069-2cc4a742ddc7',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.62.238',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: 'fj31pj6yc1'
    },
    body: '{"botId":5647754848,"sendMethod":"sendPhoto","message":{"id":"6cb32ff5-7c00-4451-a610-d608c1ea09ef","text":"<p>asdfasdfdsasadfds</p>\\n","attachments":[{"discriminator":"ITelegramFile","id":"AgACAgIAAxkBAAIl7WQmztq6aC432c2nkdcJskmLbje_AALLxzEbrgY5SbjnlugbIRILAQADAgADeAADLwQ","botId":5647754848,"masterId":"199163834","name":"2023-03-31T12:15:23.425Z","mediaType":"PHOTO","fileSize":32462,"tags":[],"createdAt":"2023-03-31T12:15:23.425Z","updatedAt":"2023-03-31T12:15:23.425Z"}]}}',
    isBase64Encoded: false
};
async function main() {
    SendTestMessageHandler(event as any, '' as any);
}

main();
