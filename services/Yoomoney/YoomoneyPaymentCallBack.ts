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

        const notififation = Object.fromEntries(params.entries()) as unknown as IYooMoneyNotification;

        const paymentKey = {
            paymentId: notififation.label,
            hash: CryptoJS.AES.encrypt(notififation.label, process.env.openDataHashKey!).toString()
        };

        const payment = await PaymentOptionsManager.GetPaymentRequestForPublic(paymentKey);

        if (!payment) {
            throw 'NEW payment not found in DB';
        }

        if (payment.optionProviderId !== EPaymentOptionProviderId.RU_YOOMONEY) {
            throw 'this is not a RU_YOOMONEY payment';
        }

        if (payment.currency !== ESupportedCurrency.RUB) {
            throw 'currency is not RUB';
        }

        if (payment.price !== Number(notififation.amount)) {
            throw 'price does not equal amount';
        }

        const paymentOption = await PaymentOptionsManager.GetDecryptedPaymentOption({
            botUUID: payment.botUUID,
            masterId: payment.masterId,
            id: payment.paymentOptionId
        });

        if (paymentOption.success == false || !paymentOption.data) {
            throw 'paymentOption not found';
        }

        if (paymentOption.data.type.optionProviderId !== EPaymentOptionProviderId.RU_YOOMONEY) {
            throw 'paymentOption provider is not RU_YOOMONEY';
        }

        const secretKey = paymentOption.data.type.token;

        const notificationWithSecret: IYooMoneyNotificationAndSecret = {
            ...notififation,
            notification_secret: secretKey
        };

        const pattern = 'notification_type&operation_id&amount&currency&datetime&sender&codepro&notification_secret&label';
        const signature = pattern
            .split('&')
            .map((key) => notificationWithSecret[key as keyof typeof notificationWithSecret])
            .join('&');

        const hash = createHash('sha1').update(signature).digest();

        if (!timingSafeEqual(hash, Buffer.from(notificationWithSecret.sha1_hash, 'hex'))) {
            throw 'Error:hash mistmach';
        }

        //если дошли сюда то у нас на руках есть подтверденный платеж на правильную сумму от юмани
        //теперь надо его запустить в процессинг

        const sqsEvent: IRequestToConfirmPayment = {
            botUUID: payment.botUUID,
            masterId: payment.masterId,
            chatId: payment.chatId,
            id: payment.id.toString(),
            action: 'Confirm' as TelegramActionKey
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
