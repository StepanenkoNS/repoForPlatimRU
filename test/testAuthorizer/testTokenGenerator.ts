import { handler } from '../../services/TokenService/Lambdas/lambdaTokenService';

const event = {
    resource: '/getToken',
    path: '/getToken',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        Host: 'auth.pompona.net',
        'Postman-Token': '3731088f-ffc2-40ad-bbae-dc64cb040f2b',
        'User-Agent': 'PostmanRuntime/7.32.2',
        'X-Amzn-Trace-Id': 'Root=1-6475d548-6a7ab0f32de1acad7a6bb2af',
        'X-Forwarded-For': '176.232.63.145',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Accept-Encoding': ['gzip, deflate, br'],
        'Cache-Control': ['no-cache'],
        'Content-Type': ['application/json'],
        Host: ['auth.pompona.net'],
        'Postman-Token': ['3731088f-ffc2-40ad-bbae-dc64cb040f2b'],
        'User-Agent': ['PostmanRuntime/7.32.2'],
        'X-Amzn-Trace-Id': ['Root=1-6475d548-6a7ab0f32de1acad7a6bb2af'],
        'X-Forwarded-For': ['176.232.63.145'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'b7bro6',
        resourcePath: '/getToken',
        httpMethod: 'POST',
        extendedRequestId: 'Fu5DZGQiIAMFVkw=',
        requestTime: '30/May/2023:10:51:52 +0000',
        path: '/getToken',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1685443912672,
        requestId: 'd69847af-d66e-4c67-bba2-d7675be49da5',
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
            userAgent: 'PostmanRuntime/7.32.2',
            user: null
        },
        domainName: 'auth.pompona.net',
        apiId: 'zayyzfynk5'
    },
    body: '{"id":199163834,\n"first_name":"Nick",\n"username":"LikeAHurricane",\n"photo_url":"https://t.me/i/userpic/320/DoQAgE8qIeUTYNunz_mwxXZcwuObFbcdDNXYeIKRBRo.jpg",\n"auth_date":1685443639,\n"hash":"de4a3955c6b4c17cd5af53e95ab18beb68210ffa3b2bfca4f1effc55bb6ab640"}',
    isBase64Encoded: false
};

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    await handler(event as any);
}

main();

//     },
//     body: '{"id":1862254,"first_name":"Tania","last_name":"Selfreflexia","username":"radiojoy","photo_url":"https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg","auth_date":1682335088,"hash":"820b5ea45b4e46a08428e36cfee6c3636d3268942d1b2231d3f1516f5a20bbd7"}',
//     isBase64Encoded: false
// };
