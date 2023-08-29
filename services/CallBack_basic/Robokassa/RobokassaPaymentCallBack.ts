import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import CryptoJS from 'crypto-js';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { createHash, timingSafeEqual } from 'crypto';

import {
    EPaymentOptionProviderId,
    ESupportedCurrency,
    IPaymentOptionType_RU_ROBOKASSA,
    IRequestToConfirmPayment,
    IYooMoneyNotification,
    IYooMoneyNotificationAndSecret
} from 'tgbot-project-types/TypesCompiled/paymentTypes';
//@ts-ignore
import { PaymentOptionManager } from '/opt/PaymentOptionManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';

import { TelegramActionKey } from 'tgbot-project-types/TypesCompiled/telegramTypesPrimitive';
//@ts-ignore
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
import { PaymentManager } from '/opt/PaymentManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));
        const origin = SetOrigin(event);

        const params = new URLSearchParams(event.body ? event.body : '');

        const notififation = Object.fromEntries(params.entries()) as any;

        const incomingHash = notififation.SignatureValue as string;

        const paymentCounterId = Number(notififation.InvId);

        const price = Number(notififation.IncSum);

        const payment = await PaymentCallBackManager.GetPaymentByPublicCounter({
            counter: paymentCounterId,
            expectedProvider: EPaymentOptionProviderId.RU_ROBOKASSA
        });
        if (!payment) {
            throw 'PaymentError';
        }

        const paymentOption = await PaymentCallBackManager.GetPaymentOption({
            key: {
                botUUID: payment.botUUID,
                masterId: payment.masterId,
                id: payment.paymentOptionId
            },
            expectedProvider: EPaymentOptionProviderId.RU_ROBOKASSA
        });

        if (!paymentOption) {
            throw 'paymentOption not found or invalid';
        }

        const password2 = (paymentOption.type as IPaymentOptionType_RU_ROBOKASSA).password2;

        const hashString = `${price.toString()}:${payment.paymentOrderN}:${password2}`;

        const hash = CryptoJS.MD5(hashString).toString().toUpperCase();

        if (incomingHash !== hash) {
            const error = 'Hash does not match';
            console.log(error);
            return ReturnBlankApiResult(403, { success: false, data: { error: error } }, origin);
        }

        const sqsResult = await PaymentCallBackManager.QueuePaymentProcessing({
            payment: payment,
            externalData: notififation
        });

        if (sqsResult == false) {
            throw 'Error: Failed to queuee';
        }

        return ReturnBlankApiResult(200, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(503, { success: true }, '');
    }
}
