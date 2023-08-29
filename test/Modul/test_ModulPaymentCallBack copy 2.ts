import CryptoJS from 'crypto-js';

import { handler } from '../../services/CallBack_basic/Yoomoney/YoomoneyPaymentCallBack';

const event = {
    resource: '/yoomoneyRU/callback',
    path: '/yoomoneyRU/callback',
    httpMethod: 'POST',
    headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'payments.zuzona.com',
        'User-Agent': 'AHC/2.1',
        'X-Amzn-Trace-Id': 'Root=1-64e9db10-32783163066d37597de697d7',
        'X-Forwarded-For': '77.75.157.42',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        Accept: ['*/*'],
        'Content-Type': ['application/x-www-form-urlencoded'],
        Host: ['payments.zuzona.com'],
        'User-Agent': ['AHC/2.1'],
        'X-Amzn-Trace-Id': ['Root=1-64e9db10-32783163066d37597de697d7'],
        'X-Forwarded-For': ['77.75.157.42'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: 'lno50w',
        resourcePath: '/yoomoneyRU/callback',
        httpMethod: 'POST',
        extendedRequestId: 'KQ8qrGyMIAMEuJw=',
        requestTime: '26/Aug/2023:10:59:28 +0000',
        path: '/yoomoneyRU/callback',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693047568844,
        requestId: '1fa086c5-ebab-460f-8e2e-8fd8c608f132',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '77.75.157.42',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: 'AHC/2.1',
            user: null
        },
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: 'notification_type=card-incoming&zip=&bill_id=&amount=9.70&firstname=&codepro=false&withdraw_amount=10.00&city=&unaccepted=false&label=2UVnqIdRflNM7GAz86RcbGIvFDA&building=&lastname=&datetime=2023-08-26T10%3A59%3A20Z&suite=&sender=&phone=&sha1_hash=660a0a77ac21df769248ad7a3aceca5a0731c646&street=&flat=&fathersname=&operation_label=2c7beeb9-0011-5000-9000-165ac6d53d6a&operation_id=746362760014136100&currency=643&email=',
    isBase64Encoded: false
};

async function main() {
    // const masterId = '199163834';
    // const botTokenEncryptionSalt = '2222';
    // const token = 'Fe1YAR/+3mR812RqK8KPxjJC';
    // const salt = `${masterId}#${botTokenEncryptionSalt!}`;
    // рабочий для hex
    // const encryptedToken_base64 = CryptoJS.AES.encrypt(token, salt).toString();
    // const enc64 = CryptoJS.enc.Base64.parse(encryptedToken_base64);
    // const encHex = enc64.toString(CryptoJS.enc.Hex);

    // const cipherText = encHex;

    // const reb64 = CryptoJS.enc.Hex.parse(cipherText);
    // const bytes = reb64.toString(CryptoJS.enc.Base64);
    // const decrypt = CryptoJS.AES.decrypt(bytes, salt);
    // const plain = decrypt.toString(CryptoJS.enc.Utf8);
    // console.log(plain);

    // const encryptedToken_base64 = CryptoJS.AES.encrypt(token, salt).toString(CryptoJS.format.Hex);
    // const enc64 = CryptoJS.enc.Base64.parse(encryptedToken_base64);
    // const encHex = enc64.toString(CryptoJS.enc.Hex);

    // const cipherText = encHex;

    // const reb64 = CryptoJS.enc.Hex.parse(cipherText);
    // const bytes = reb64.toString(CryptoJS.enc.Base64);
    // const decrypt = CryptoJS.AES.decrypt(bytes, salt);
    // const plain = decrypt.toString(CryptoJS.enc.Utf8);
    // console.log(plain);

    //рабочий вариант для utf8

    // const encryptedToken = CryptoJS.AES.encrypt(token, salt);
    // const encryptedTokenStr = encryptedToken.toString(CryptoJS.format.OpenSSL);

    // const tmpDecript = CryptoJS.AES.decrypt(encryptedTokenStr, salt);
    // const decriptedToken = tmpDecript.toString(CryptoJS.enc.Utf8);

    //return;
    await handler(event as any);
}

main();
