import { handler } from '../../services/TokenService/Lambdas/lambdaTokenService';

const event = {
    resource: '/me',
    path: '/me',
    httpMethod: 'GET',
    headers: {
        accept: 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-GB,en;q=0.9',
        cookie: '_ym_isad=2; _ym_visorc=w; _ym_d=1685442148; _ym_uid=1685442148978851236',
        Host: 'auth.pompona.net',
        origin: 'https://admin.pompona.net',
        referer: 'https://admin.pompona.net/',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'X-Amzn-Trace-Id': 'Root=1-64774790-51f1307c519a310a46d83d73',
        'X-Forwarded-For': '5.176.5.95',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        accept: ['application/json, text/plain, */*'],
        'accept-encoding': ['gzip, deflate, br'],
        'accept-language': ['en-GB,en;q=0.9'],
        cookie: ['_ym_isad=2; _ym_visorc=w; _ym_d=1685442148; _ym_uid=1685442148978851236'],
        Host: ['auth.pompona.net'],
        origin: ['https://admin.pompona.net'],
        referer: ['https://admin.pompona.net/'],
        'sec-fetch-dest': ['empty'],
        'sec-fetch-mode': ['cors'],
        'sec-fetch-site': ['same-site'],
        'User-Agent': ['Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'],
        'X-Amzn-Trace-Id': ['Root=1-64774790-51f1307c519a310a46d83d73'],
        'X-Forwarded-For': ['5.176.5.95'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'tkno7h',
        resourcePath: '/me',
        httpMethod: 'GET',
        extendedRequestId: 'FygelE4xoAMFUuA=',
        requestTime: '31/May/2023:13:11:44 +0000',
        path: '/me',
        accountId: '993738567487',
        protocol: 'HTTP/1.1',
        stage: 'GetToken',
        domainPrefix: 'auth',
        requestTimeEpoch: 1685538704249,
        requestId: 'f30b7442-60af-4c0e-beb8-966774e19130',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '5.176.5.95',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
            user: null
        },
        domainName: 'auth.pompona.net',
        apiId: 'zayyzfynk5'
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

    const result = await handler(event as any);
    console.log(result);
}

main();

//     },
//     body: '{"id":1862254,"first_name":"Tania","last_name":"Selfreflexia","username":"radiojoy","photo_url":"https://t.me/i/userpic/320/UVuG3YvyUShnue3BuiDRkHlHYMi6UGBhco6mmyNQGB8.jpg","auth_date":1682335088,"hash":"820b5ea45b4e46a08428e36cfee6c3636d3268942d1b2231d3f1516f5a20bbd7"}',
//     isBase64Encoded: false
// };
