import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import CryptoJS from 'crypto-js';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { createHash, timingSafeEqual } from 'crypto';

import { EPaymentOptionProviderId, ESupportedCurrency, IRequestToConfirmPayment, IYooMoneyNotification, IYooMoneyNotificationAndSecret } from 'tgbot-project-types/TypesCompiled/paymentTypes';
import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';

import { TelegramActionKey } from 'tgbot-project-types/TypesCompiled/telegramTypesPrimitive';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const queryString = event.body ? event.body : '';
        const params = new URLSearchParams(queryString);

        const notififation = Object.fromEntries(params.entries()) as any;
        console.log(notififation);

        return ReturnBlankApiResult(200, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(503, { success: true }, '');
    }
}
