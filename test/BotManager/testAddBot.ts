import { AddBotHandler } from 'services/Bots/AddBotLambda';

const event = {
    resource: '/Bots/Add',
    path: '/Bots/Add',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg4NzQ4MDcsImV4cCI6MTcxMDQxMDgwN30.3d6g3-DqHj7tDvmDE36dNGQiK75O9MoNc-U0G0upNhE; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg4NzQ4MDcsImV4cCI6MTY3ODg3ODQwN30.ytGiq-jhvJw4B_8nN-P_JgXRGksFo3DbSYGy4zfejKA',
        Host: 'secure-api.pompona.net',
        origin: 'http://localhost:8080',
        referer: 'http://localhost:8080/',
        'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-64241f6a-26eb2aa205e0824d13b87a64',
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
            'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg4NzQ4MDcsImV4cCI6MTcxMDQxMDgwN30.3d6g3-DqHj7tDvmDE36dNGQiK75O9MoNc-U0G0upNhE; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg4NzQ4MDcsImV4cCI6MTY3ODg3ODQwN30.ytGiq-jhvJw4B_8nN-P_JgXRGksFo3DbSYGy4zfejKA'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['http://localhost:8080'],
        referer: ['http://localhost:8080/'],
        'sec-ch-ua': ['"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['cross-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-64241f6a-26eb2aa205e0824d13b87a64'],
        'X-Forwarded-For': ['176.232.62.238'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'dvpug0',
        authorizer: {
            renewedAccessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2Nzg4NzQ4MDcsImV4cCI6MTY3ODg3ODQwN30.ytGiq-jhvJw4B_8nN-P_JgXRGksFo3DbSYGy4zfejKA',
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 779,
            id: '199163834',
            first_name: 'Nick',
            iat: '1678874807',
            username: 'LikeAHurricane'
        },
        resourcePath: '/Bots/Add',
        httpMethod: 'POST',
        extendedRequestId: 'CinYrFtwoAMFRjg=',
        requestTime: '29/Mar/2023:11:22:18 +0000',
        path: '/Bots/Add',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1680088938497,
        requestId: '9d5bff56-8ea7-48e7-a5da-84a5e7e21ba9',
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
        domainName: 'secure-api.pompona.net',
        apiId: 'adt5y4hohl'
    },
    body: '{"discriminator":"IMasterBot","name":"testxxxxx12345bot","description":"sadfsdfds","id":5819318091,"token":"5819318091:AAHszVceH0Y_1Ji5tA3hQxlGJ5zmE4FUa-Y","masterId":199163834}',
    isBase64Encoded: false
};

async function main() {
    AddBotHandler(event as any, '' as any);
}

main();
