import { handler } from '../../../services/Robokassa/RobokassaPaymentCallBack';

const event = {
    resource: '/callback/robokassa',
    path: '/callback/robokassa',
    httpMethod: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Host: 'payments.zuzona.com',
        'User-Agent': '.NET Framework/v4.0.30319',
        'X-Amzn-Trace-Id': 'Root=1-64ec58af-6f5fd1bd09ade1e765ceba1b',
        'X-Forwarded-For': '185.59.216.65',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https'
    },
    multiValueHeaders: {
        'Content-Type': ['application/x-www-form-urlencoded; charset=utf-8'],
        Host: ['payments.zuzona.com'],
        'User-Agent': ['.NET Framework/v4.0.30319'],
        'X-Amzn-Trace-Id': ['Root=1-64ec58af-6f5fd1bd09ade1e765ceba1b'],
        'X-Forwarded-For': ['185.59.216.65'],
        'X-Forwarded-Port': ['443'],
        'X-Forwarded-Proto': ['https']
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
        resourceId: '1t4tj5',
        resourcePath: '/callback/robokassa',
        httpMethod: 'POST',
        extendedRequestId: 'KXLLaEt9IAMENeQ=',
        requestTime: '28/Aug/2023:08:19:59 +0000',
        path: '/callback/robokassa',
        accountId: '818186882185',
        protocol: 'HTTP/1.1',
        stage: 'pagesAPI',
        domainPrefix: 'payments',
        requestTimeEpoch: 1693210799187,
        requestId: '7f778248-d9b7-4288-a529-36750695d347',
        identity: {
            cognitoIdentityPoolId: null,
            accountId: null,
            cognitoIdentityId: null,
            caller: null,
            sourceIp: '185.59.216.65',
            principalOrgId: null,
            accessKey: null,
            cognitoAuthenticationType: null,
            cognitoAuthenticationProvider: null,
            userArn: null,
            userAgent: '.NET Framework/v4.0.30319',
            user: null
        },
        domainName: 'payments.zuzona.com',
        apiId: 'oyftl3dkne'
    },
    body: 'out_summ=94.72&OutSum=94.72&inv_id=3&InvId=3&crc=40F88AAEF77B2F1F08CDBDFF0A4064C2&SignatureValue=40F88AAEF77B2F1F08CDBDFF0A4064C2&PaymentMethod=BankCard&IncSum=94.72&IncCurrLabel=BankCardPSR&IsTest=1&EMail=&Fee=0.0',
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
