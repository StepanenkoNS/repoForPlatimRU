import { handler } from 'services/Meetings/EditMeetingLambda';
const event = {
    resource: '/Channels/List',
    path: '/Channels/List',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODM4OTAyMDAsImV4cCI6MTY4Mzg5MzgwMH0.AtMXssoOib3AX3UQFX3ATYSMdmj79C86ds2JhgsBhUI; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODM4OTAyMDAsImV4cCI6MTcxNTQyNjIwMH0.3YkDZebnCAUUl1LyOSK4npKem0Rqum7riZD7HqeC9zs',
        Host: 'secure-api.pompona.net',
        'Postman-Token': '776adb14-88c4-49db-8728-6fe03af4814c',
        'User-Agent': 'PostmanRuntime/7.32.2',
        'X-Amzn-Trace-Id': 'Root=1-645e28a2-492d3cdc59d40d505fac84f7',
        'X-Forwarded-For': '176.232.63.161',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODM4OTAyMDAsImV4cCI6MTY4Mzg5MzgwMH0.AtMXssoOib3AX3UQFX3ATYSMdmj79C86ds2JhgsBhUI; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE2ODM4OTAyMDAsImV4cCI6MTcxNTQyNjIwMH0.3YkDZebnCAUUl1LyOSK4npKem0Rqum7riZD7HqeC9zs'
        ],
        Host: ['secure-api.pompona.net'],
        'Postman-Token': ['776adb14-88c4-49db-8728-6fe03af4814c'],
        'User-Agent': ['PostmanRuntime/7.32.2'],
        'X-Amzn-Trace-Id': ['Root=1-645e28a2-492d3cdc59d40d505fac84f7'],
        'X-Forwarded-For': ['176.232.63.161'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: { botId: '2323' },
    multiValueQueryStringParameters: { botId: ['2323'] },
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '6vxpf3',
        authorizer: {
            role: 'superadmin',
            principalId: '199163834',
            language: 'ru',
            integrationLatency: 0,
            id: '199163834',
            exp: '1683893800',
            first_name: 'Nick',
            iat: '1683890200',
            username: 'LikeAHurricane'
        },
        resourcePath: '/Channels/List',
        httpMethod: 'GET',
        extendedRequestId: 'EztJXFWroAMFuug=',
        requestTime: '12/May/2023:11:53:06 +0000',
        path: '/Channels/List',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'SecureAPI',
        domainPrefix: 'secure-api',
        requestTimeEpoch: 1683892386020,
        requestId: '54728267-a343-4fb4-92e0-6fb1e6316223',
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
            userAgent: 'PostmanRuntime/7.32.2',
            user: null
        },
        domainName: 'secure-api.pompona.net',
        apiId: 'n73jv50gif'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    const result = await handler(event as any, '' as any);
    console.log(result);
}

main();
