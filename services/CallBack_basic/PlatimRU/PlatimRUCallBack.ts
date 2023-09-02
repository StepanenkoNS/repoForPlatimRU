import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import CryptoJS from 'crypto-js';
import crypto from 'crypto';
import { Base64 } from 'js-base64';
//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { createHash, timingSafeEqual } from 'crypto';

import { EPaymentOptionProviderId, ESupportedCurrency, IRequestToConfirmPayment, IYooMoneyNotification, IYooMoneyNotificationAndSecret } from 'tgbot-project-types/TypesCompiled/paymentTypes';

import { TelegramActionKey } from 'tgbot-project-types/TypesCompiled/telegramTypesPrimitive';
//@ts-ignore
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

const testSSLKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3WbE0VkfNMf9jud9OmrM
4fkOXo01a3qRO/at5DTHGX40dmE0ZlnNH9r7w9hLNZ6bOWQWxPp3bS50Sp/6RW9K
yNGKbxnlJ1JEAk5wlr/VKEA0PmnwpKishZA0BRAARREHmw3gHhx/o5Je1upc4VWR
6JTI506ACW1XKWnrX3ieNcD/1LUup57nkyDnozAph2MnArmeie+FTcTBKfgwc4EQ
MR02Zbm7Jmp3w3ZC0LKxnz+/FJIBDJnF18uY7YHd2VgfkPgdjZnUMczwcTkcZpi4
oktPVdXMjA/Ptw2+C4Iy+eDxLtHlQS39Ihbm6I/J8Mv50KqAwsqPs9QtC5wGUjxP
DQIDAQAB
-----END PUBLIC KEY-----`;

const prodSSLKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5Y5SW4/YsgaK0tnnEI6T
vbWOlw7v/5vRlVOdiekasQChVSJ0clZ6qYOitXrR/T+KxwmvXB348ueE/zv3X/wB
DdOL+ufkeFlDbejZPXaUw/oowz+Xr0UsHMHXfJ8p+P86w1TjKYWqaHvHxkPMBGRf
wsYTufiGHA2Jec5QBYkqtXoGQSp1cA1goyvMqECjoBtGWFCZY8+GMTm43olIt4XX
rTwfoOt0BMZ803bjnZB4gp4/t7GNLhiq4zB+oTGXkpXh+X71zgbc8zIR+btDiLsC
dsLENchs+bvx2Mxpgu7Ukg27gQH1fXypWLcnn12kXknFZWevfSKix5ybHPgkjXee
NQIDAQAB
-----END PUBLIC KEY-----`;

export interface ILooseObject {
    [key: string]: any;
}

function IsScalar(value: any) {
    if (value == undefined || value == null) {
        return false;
    }
    const retValue = value.constructor === String || value.constructor === Number || value.constructor === Boolean;
    return retValue;
}
function GetPlatimRuSignature<T extends object>(publicSSLKey: string, formData: T) {
    const values: ILooseObject = {};
    const tmpFormData = formData as ILooseObject;
    const tmp1Decoded = Base64.decode(tmpFormData.signature).toString();
    const tmp2Decoded = CryptoJS.enc.Base64.parse(tmpFormData.signature).toString();
    const decodedSignature = tmp2Decoded;

    const sortedScalarKeys = Object.keys(formData)
        .filter((key) => key !== 'signature')
        .filter((key) => {
            const typedKey = key as keyof T;
            const isScalar = IsScalar(formData[typedKey]);
            return isScalar;
        })
        .sort();

    sortedScalarKeys.forEach((key) => {
        const typedKey = key as keyof T;
        const dataItem = formData[typedKey];
        values[key] = dataItem;
    });

    const publicKey = crypto.createPublicKey(publicSSLKey);

    const jsonScalarValues = JSON.stringify(values);
    console.log(jsonScalarValues);

    const jsonStringifiedData = Buffer.from(jsonScalarValues);
    const signatureData = Buffer.from(decodedSignature);
    const verified = crypto.verify('SHA1', jsonStringifiedData, publicKey, signatureData);

    return verified;
}

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const notififation = JSON.parse(event.body ? event.body : '');

        //console.log(notififation);

        const sortedData = GetPlatimRuSignature(testSSLKey, notififation);

        return ReturnBlankApiResult(200, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(503, { success: true }, '');
    }
}
