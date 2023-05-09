import { handler } from 'services/SendMessage/SendTestMessageLambda';

const event = {
    resource: '/SendTestMessage/SendTestMessage',
    path: '/SendTestMessage/SendTestMessage',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/x-www-form-urlencoded',
        cookie: '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODM2MDkxNTksImV4cCI6MTcxNTE0NTE1OX0.jSeGb4ax5Zf2aV_M_wCeg_7d2b28X5KyI0rU0az2drk; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzNjYyODIzLCJleHAiOjE2ODM2NjY0MjN9.0mCdh9uCZ6x86GSIMfmRA3sXsN9SKYut62EuaNt-J_M',
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
        'X-Amzn-Trace-Id': 'Root=1-645aac8d-2205ecc319afdf9b49f143df',
        'X-Forwarded-For': '176.232.63.161',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en,tr;q=0.9,ru;q=0.8'],
        'content-type': ['application/x-www-form-urlencoded'],
        cookie: [
            '_ym_uid=1682491530212273390; _ym_d=1682491530; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODM2MDkxNTksImV4cCI6MTcxNTE0NTE1OX0.jSeGb4ax5Zf2aV_M_wCeg_7d2b28X5KyI0rU0az2drk; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjgzNjYyODIzLCJleHAiOjE2ODM2NjY0MjN9.0mCdh9uCZ6x86GSIMfmRA3sXsN9SKYut62EuaNt-J_M'
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
        'X-Amzn-Trace-Id': ['Root=1-645aac8d-2205ecc319afdf9b49f143df'],
        'X-Forwarded-For': ['176.232.63.161'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '8coomv',
        authorizer: {
            principalId: '199163834',
            integrationLatency: 0,
            id: '199163834',
            exp: '1683666423',
            iat: '1683662823',
            username: 'LikeAHurricane'
        },
        resourcePath: '/SendTestMessage/SendTestMessage',
        httpMethod: 'POST',
        extendedRequestId: 'Eq_mMESsIAMFnkg=',
        requestTime: '09/May/2023:20:26:53 +0000',
        path: '/SendTestMessage/SendTestMessage',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1683664013700,
        requestId: '24dfd8dc-018e-48f2-8dd7-58c162b5e106',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.63.161',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            user: null
        },
        domainName: 'secure-api.zuzona.com',
        apiId: '1974yjawb1'
    },
    body: '{"botId":5795087844,"sendMethod":"sendMessage","message":{"text":"<p>Мой секретный рецепт торта</p>\\n","attachments":[{"discriminator":"ITelegramFile","id":"AgACAgIAAxkBAAIIzWRRRBA_gY30uPUwtbaHwXdnTLOGAAKxyDEbEoKJSgf4FH4SQSI3AQADAgADeQADLwQ","botId":5795087844,"masterId":199163834,"name":"файл 2","mediaType":"PHOTO","fileSize":205322,"tags":["adsf","asdf","12341234231423"],"createdAt":"2023-05-02T17:10:40.822Z","updatedAt":"2023-05-07T15:06:25.874Z"}]},"interaction":{"type":"NONE"},"contentPlanId":"PAIDPOST","contentPlanPostId":"DRAFT","trigger":{"type":"PAID_POST","prices":[{"price":1000,"currency":"RUB"},{"price":50,"currency":"USD"}]}}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any, '' as any);
}

main();
