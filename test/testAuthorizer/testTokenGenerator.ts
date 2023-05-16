import { handler } from '../../services/TokenService/Lambdas/lambdaTokenService';

const event = {
    resource: '/me',
    path: '/me',
    httpMethod: 'GET',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Cookie: 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg0MTU3MzUyLCJleHAiOjE2ODQxNTc2NTJ9.6uXLs-0T84i4dAFl8h3cPP4LvFuAHsVrNj72cRq9tYA; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUG91RHEzTnRpWHQwWllSTHZuWWxyVkRmZHQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMTVUMDc6Mjc6MTguMzUzWiIsIkRGIjoiMjAyNC0wNS0xNFQwNzoyNzoxOC4zNTNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODQxNTcxMTUsImV4cCI6MTcxNTY5MzExNX0.-ZCnqs8-UFrjKdG5UO4V_hgYzw82c5_ekmsogBNEbTI',
        Host: 'auth.zuzona.com',
        'Postman-Token': 'cbc04295-68f3-49ad-b3d8-bf8d0bfa0f1d',
        'User-Agent': 'PostmanRuntime/7.32.2',
        'X-Amzn-Trace-Id': 'Root=1-646233cd-0b9998544489aa8753f628b3',
        'X-Forwarded-For': '176.232.61.19',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        Cookie: [
            'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJ1c2VybmFtZSI6Ikxpa2VBSHVycmljYW5lIiwiaWF0IjoxNjg0MTU3MzUyLCJleHAiOjE2ODQxNTc2NTJ9.6uXLs-0T84i4dAFl8h3cPP4LvFuAHsVrNj72cRq9tYA; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTk5MTYzODM0LCJmaXJzdF9uYW1lIjoiTmljayIsInVzZXJuYW1lIjoiTGlrZUFIdXJyaWNhbmUiLCJsYW5ndWFnZSI6InJ1Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJ6dXpvbmFTdWJzY3JpcHRpb24iOnsiaWQiOiIyUG91RHEzTnRpWHQwWllSTHZuWWxyVkRmZHQiLCJzdWJzY3JpcHRpb25QbGFuIjoiVFJJQUwiLCJEUyI6IjIwMjMtMDUtMTVUMDc6Mjc6MTguMzUzWiIsIkRGIjoiMjAyNC0wNS0xNFQwNzoyNzoxOC4zNTNaIiwic3Vic2NyaXB0aW9uTGV2ZWwiOjB9LCJpYXQiOjE2ODQxNTcxMTUsImV4cCI6MTcxNTY5MzExNX0.-ZCnqs8-UFrjKdG5UO4V_hgYzw82c5_ekmsogBNEbTI'
        ],
        Host: ['auth.zuzona.com'],
        'Postman-Token': ['cbc04295-68f3-49ad-b3d8-bf8d0bfa0f1d'],
        'User-Agent': ['PostmanRuntime/7.32.2'],
        'X-Amzn-Trace-Id': ['Root=1-646233cd-0b9998544489aa8753f628b3'],
        'X-Forwarded-For': ['176.232.61.19'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'iwnpr6',
        resourcePath: '/me',
        httpMethod: 'GET',
        extendedRequestId: 'E90IGH42oAMFk6g=',
        requestTime: '15/May/2023:13:29:49 +0000',
        path: '/me',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1684157389164,
        requestId: '071e3277-59ae-46f7-875e-e8a9fd71e944',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '176.232.61.19',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'PostmanRuntime/7.32.2',
            user: null
        },
        domainName: 'auth.zuzona.com',
        apiId: '8fu0fusfik'
    },
    body: null,
    isBase64Encoded: false
};

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    handler(event as any);
}

main();

//     },
//     body: '{"id":1862254,"first_name":"Tania","last_name":"Selfreflexia","username":"radiojoy","photo_url":"https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg","auth_date":1682335088,"hash":"820b5ea45b4e46a08428e36cfee6c3636d3268942d1b2231d3f1516f5a20bbd7"}',
//     isBase64Encoded: false
// };
