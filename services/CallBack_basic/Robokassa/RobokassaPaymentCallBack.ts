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
import { PaymentOptionManager } from '/opt/PaymentOptionManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';

import { TelegramActionKey } from 'tgbot-project-types/TypesCompiled/telegramTypesPrimitive';
import { PaymentManager } from '/opt/PaymentManager';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));
        const origin = SetOrigin(event);

        const queryString = event.body ? event.body : '';
        const params = new URLSearchParams(queryString);

        const notififation = Object.fromEntries(params.entries()) as any;
        console.log(notififation);

        const incomingHash = notififation.SignatureValue as string;

        const paymentCounterId = Number(notififation.InvId);

        const price = Number(notififation.IncSum);

        const payment = await PaymentManager.GetPaymentRequestForPublicByCounter(paymentCounterId);
        if (!payment) {
            throw 'NEW payment not found in DB';
        }

        if (payment.optionProviderId !== EPaymentOptionProviderId.RU_ROBOKASSA) {
            throw 'this is not a RU_ROBOKASSA payment';
        }

        const paymentOption = await PaymentOptionManager.GetDecryptedPaymentOption({
            botUUID: payment.botUUID,
            masterId: payment.masterId,
            id: payment.paymentOptionId
        });

        if (paymentOption.success == false || !paymentOption.data) {
            throw 'paymentOption not found';
        }

        if (paymentOption.data.type.optionProviderId !== EPaymentOptionProviderId.RU_ROBOKASSA) {
            throw 'paymentOption provider is not RU_ROBOKASSA';
        }

        const password2 = (paymentOption.data.type as IPaymentOptionType_RU_ROBOKASSA).password2;

        let hashString = '';
        hashString = `${price.toString()}:${payment.paymentOrderN}:${password2}`;
        // if (payment.currency == ESupportedCurrency.RUB) {
        //     hashString = `${price.toString()}:${payment.paymentOrderN}:${password2}`;
        // } else {
        //     hashString = `${price.toString()}:${payment.paymentOrderN}:${payment.currency}:${password2}`;
        // }

        //const hashString = `${paymentOption.data.type.shopId}:${payment.price.toString()}:${payment.paymentOrderN}:${payment.currency}:${password2}`;
        const hash = CryptoJS.MD5(hashString).toString().toUpperCase();

        if (incomingHash !== hash) {
            const error = 'Hash does not match';
            console.log(error);
            return ReturnBlankApiResult(403, { success: false, data: { error: error } }, origin);
        }

        const sqsEvent: IRequestToConfirmPayment = {
            botUUID: payment.botUUID,
            masterId: payment.masterId,
            chatId: payment.chatId,
            id: payment.id.toString(),
            action: 'Confirm' as TelegramActionKey,
            externalDetails: {
                dt: new Date().toISOString(),
                externalJSON: JSON.stringify(notififation)
            }
        };

        const sqsResult = await SQSHelper.SendSQSMessage({
            message: sqsEvent,
            QueueUrl: process.env.paymentProcessorConfirmationRequestQueueURL!
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
