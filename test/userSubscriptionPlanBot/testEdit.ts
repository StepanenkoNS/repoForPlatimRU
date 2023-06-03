import { handler } from 'services/UserSubscriptionPlansBot/EditUserSubscriptionPlanLambda';

const event = {
    resource: '/UserSubscriptionPlansBot/Edit',
    path: '/UserSubscriptionPlansBot/Edit',
    httpMethod: 'PUT',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en,tr;q=0.9,ru;q=0.8',
        'content-type': 'application/json',
        cookie: '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUWI3SldOWklyR2FQM0M3Tk4zWmtuMTh6TU0iLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDFUMDk6MDU6NTUuMjAxWiIsIkRGIjoiMjAyMy0wNy0wMVQwOTowNTo1NS4yMDFaIn0sImlhdCI6MTY4NTYxMDM1NywiZXhwIjoxNzE3MTQ2MzU3fQ.ULh8FUAbSpsd-Nl0PeUORzQlrgVmHuFBIQddbhttL18; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7Im1hc3RlcklkIjoxOTkxNjM4MzQsIkRGIjoiMjAyMy0wNy0wMVQwOTowNTo1NS4yMDFaIiwiaWQiOiIyUWI3SldOWklyR2FQM0M3Tk4zWmtuMTh6TU0iLCJkYXRlUGFpZCI6IjIwMjMtMDYtMDFUMDk6MDU6NTUuMjAxWiIsInN1YnNjcmlwdGlvblBsYW4iOiJUUklBTCIsIkRTIjoiMjAyMy0wNi0wMVQwOTowNTo1NS4yMDFaIn0sImZpcnN0X25hbWUiOiJOaWNrIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvRG9RQWdFOHFJZVVUWU51bnpfbXd4WFpjd3VPYkZiY2RETlhZZUlLUkJSby5qcGciLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1Njk5NTAwLCJleHAiOjE2ODU2OTk4MDB9.8BWEexJURWgmVeQdaX72LapJ5fYjPNu4Bo6POF6kcSI',
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
        'X-Amzn-Trace-Id': 'Root=1-6479bd65-2756456759c201c5287e3e45',
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
            '_ym_uid=1685442074515823837; _ym_d=1685442074; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInBob3RvX3VybCI6Imh0dHBzOi8vdC5tZS9pL3VzZXJwaWMvMzIwL0RvUUFnRThxSWVVVFlOdW56X213eFhaY3d1T2JGYmNkRE5YWWVJS1JCUm8uanBnIiwidXNlcm5hbWUiOiJMaWtlQUh1cnJpY2FuZSIsImxhbmd1YWdlIjoicnUiLCJyb2xlIjoic3VwZXJhZG1pbiIsInBvbXBvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUWI3SldOWklyR2FQM0M3Tk4zWmtuMTh6TU0iLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDYtMDFUMDk6MDU6NTUuMjAxWiIsIkRGIjoiMjAyMy0wNy0wMVQwOTowNTo1NS4yMDFaIn0sImlhdCI6MTY4NTYxMDM1NywiZXhwIjoxNzE3MTQ2MzU3fQ.ULh8FUAbSpsd-Nl0PeUORzQlrgVmHuFBIQddbhttL18; accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJwb21wb25hU3Vic2NyaXB0aW9uIjp7Im1hc3RlcklkIjoxOTkxNjM4MzQsIkRGIjoiMjAyMy0wNy0wMVQwOTowNTo1NS4yMDFaIiwiaWQiOiIyUWI3SldOWklyR2FQM0M3Tk4zWmtuMTh6TU0iLCJkYXRlUGFpZCI6IjIwMjMtMDYtMDFUMDk6MDU6NTUuMjAxWiIsInN1YnNjcmlwdGlvblBsYW4iOiJUUklBTCIsIkRTIjoiMjAyMy0wNi0wMVQwOTowNTo1NS4yMDFaIn0sImZpcnN0X25hbWUiOiJOaWNrIiwicGhvdG9fdXJsIjoiaHR0cHM6Ly90Lm1lL2kvdXNlcnBpYy8zMjAvRG9RQWdFOHFJZVVUWU51bnpfbXd4WFpjd3VPYkZiY2RETlhZZUlLUkJSby5qcGciLCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg1Njk5NTAwLCJleHAiOjE2ODU2OTk4MDB9.8BWEexJURWgmVeQdaX72LapJ5fYjPNu4Bo6POF6kcSI'
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
        'X-Amzn-Trace-Id': ['Root=1-6479bd65-2756456759c201c5287e3e45'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'h3i1l3',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            pomponaSubscription:
                '{"masterId":199163834,"DF":"2023-07-01T09:05:55.201Z","id":"2Qb7JWNZIrGaP3C7NN3Zkn18zMM","datePaid":"2023-06-01T09:05:55.201Z","subscriptionPlan":"TRIAL","DS":"2023-06-01T09:05:55.201Z"}',
            integrationLatency: 0,
            id: '199163834',
            photo_url: 'https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg',
            exp: '1685699800',
            first_name: 'Nick',
            iat: '1685699500',
            username: 'LikeAHurricane'
        },
        resourcePath: '/UserSubscriptionPlansBot/Edit',
        httpMethod: 'PUT',
        extendedRequestId: 'F4qH4F9vIAMFapQ=',
        requestTime: '02/Jun/2023:09:59:01 +0000',
        path: '/UserSubscriptionPlansBot/Edit',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1685699941310,
        requestId: '5566ee6a-1e56-4730-9aef-054964fe374a',
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
        apiId: 'nvgz27hiu8'
    },
    body: '{"id":"PdVCMTrzZZDS","masterId":199163834,"name":"Уроки рисования","botId":5944896623,"contentPlans":[{"contentPlanId":"BguKVsCT7VVs","contentPlanName":""},{"contentPlanId":"bI8LQ6ame_SX","contentPlanName":""}],"enabled":true,"lifeTime":false,"prices":[{"price":100,"currency":"RUB"},{"price":1,"currency":"BTC"},{"price":10,"currency":"USD"}],"lengthInDays":10}',
    isBase64Encoded: false
};

async function main() {
    handler(event as any);
}

main();
