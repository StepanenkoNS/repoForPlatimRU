import { handler } from 'services/PaymentProcessor/ModulPaymentGenerateData';

const event = {
    resource: '/modul_ru/GeneratePayment',
    path: '/modul_ru/GeneratePayment',
    httpMethod: 'POST',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/json',
        cookie: '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW44RDNMWXhHcmpxd2xSd2hla3VGWkd1VEwiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMTU6MTE6MDEuMDk1WiIsIkRGIjoiMjAyMy0wNy0wNVQxNToxMTowMS4wOTVaIn0sImlhdCI6MTY4NTk3Nzg2MywiZXhwIjoxNzE3NTEzODYzfQ.g_E1Ex1EWbM7oiD06-y6qwgMWmOwSGOJxAm4neiBLW0; _ym_isad=1; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7Im1hc3RlcklkIjoxOTkxNjM4MzQsIkRGIjoiMjAyMy0wNy0wNVQxNToxMTowMS4wOTVaIiwiaWQiOiIyUW44RDNMWXhHcmpxd2xSd2hla3VGWkd1VEwiLCJkYXRlUGFpZCI6IjIwMjMtMDYtMDVUMTU6MTE6MDEuMDk2WiIsInN1YnNjcmlwdGlvblBsYW4iOiJUUklBTCIsIkRTIjoiMjAyMy0wNi0wNVQxNToxMTowMS4wOTVaIn0sImZpcnN0X25hbWUiOiJOaWNrIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvRG9RQWdFOHFJZVVUWU51bnpfbXd4WFpjd3VPYkZiY2RETlhZZUlLUkJSby5qcGciLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1OTkzMTYwLCJleHAiOjE2ODU5OTM0NjB9.qrFvjEFfVG9bvU_PXjIj629A3Hdrnk5m_TgHWFiy0AI',
        Host: 'secure-api.pompona.net',
        origin: 'https://admin.pompona.net',
        referer: 'https://admin.pompona.net/',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
        'X-Amzn-Trace-Id': 'Root=1-647e378f-361453294ab4dd0c22b6ad25',
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
            '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUW44RDNMWXhHcmpxd2xSd2hla3VGWkd1VEwiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDVUMTU6MTE6MDEuMDk1WiIsIkRGIjoiMjAyMy0wNy0wNVQxNToxMTowMS4wOTVaIn0sImlhdCI6MTY4NTk3Nzg2MywiZXhwIjoxNzE3NTEzODYzfQ.g_E1Ex1EWbM7oiD06-y6qwgMWmOwSGOJxAm4neiBLW0; _ym_isad=1; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7Im1hc3RlcklkIjoxOTkxNjM4MzQsIkRGIjoiMjAyMy0wNy0wNVQxNToxMTowMS4wOTVaIiwiaWQiOiIyUW44RDNMWXhHcmpxd2xSd2hla3VGWkd1VEwiLCJkYXRlUGFpZCI6IjIwMjMtMDYtMDVUMTU6MTE6MDEuMDk2WiIsInN1YnNjcmlwdGlvblBsYW4iOiJUUklBTCIsIkRTIjoiMjAyMy0wNi0wNVQxNToxMTowMS4wOTVaIn0sImZpcnN0X25hbWUiOiJOaWNrIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvRG9RQWdFOHFJZVVUWU51bnpfbXd4WFpjd3VPYkZiY2RETlhZZUlLUkJSby5qcGciLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1OTkzMTYwLCJleHAiOjE2ODU5OTM0NjB9.qrFvjEFfVG9bvU_PXjIj629A3Hdrnk5m_TgHWFiy0AI'
        ],
        Host: ['secure-api.pompona.net'],
        origin: ['https://admin.pompona.net'],
        referer: ['https://admin.pompona.net/'],
        'sec-ch-ua': ['"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"'],
        'sec-ch-ua-mobile': ['?0'],
        'sec-ch-ua-platform': ['"macOS"'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['same-site'],
        'User-Agent': ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'],
        'X-Amzn-Trace-Id': ['Root=1-647e378f-361453294ab4dd0c22b6ad25'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'b2eseh',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription:
                '{"masterId":199163834,"DF":"2023-07-05T15:11:01.095Z","id":"2Qn8D3LYxGrjqwlRwhekuFZGuTL","datePaid":"2023-06-05T15:11:01.096Z","subscriptionPlan":"TRIAL","DS":"2023-06-05T15:11:01.095Z"}',
            integrationLatency: 0,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1685993460',
            first_name: 'Nick',
            iat: '1685993160',
            username: 'LikeAHurricane'
        },
        resourcePath: '/modul_ru/GeneratePayment',
        httpMethod: 'POST',
        extendedRequestId: 'GD2eeFbEIAMFmxg=',
        requestTime: '05/Jun/2023:19:29:19 +0000',
        path: '/modul_ru/GeneratePayment',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685993359551,
        requestId: 'e9123a8f-5cb9-4910-9db0-587953e3070b',
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
        apiId: 'gwzyb9icnh'
    },
    body: '{"currency":"RUB","lengthInDays":365,"masterId":0,"pricePaid":40000,"subscriptionPlan":"PAIDBOT","subscriptionLevel":2}',
    isBase64Encoded: false
};

async function main() {
    await handler(event as any);
}

main();
