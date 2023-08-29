import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import CryptoJS from 'crypto-js';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { createHash, timingSafeEqual } from 'crypto';

import {
    EPaymentOptionProviderId,
    ESupportedCurrency,
    IPaymentOptionType_RU_YOOMONEY,
    IRequestToConfirmPayment,
    IYooMoneyNotification,
    IYooMoneyNotificationAndSecret,
    PaymentOptionType
} from 'tgbot-project-types/TypesCompiled/paymentTypes';

import { PaymentManager } from '/opt/PaymentManager';
import { PaymentOptionManager } from '/opt/PaymentOptionManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';

import { TelegramActionKey } from 'tgbot-project-types/TypesCompiled/telegramTypesPrimitive';
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const params = new URLSearchParams(event.body ? event.body : '');

        const notififation = Object.fromEntries(params.entries()) as unknown as IYooMoneyNotification;

        const payment = await PaymentCallBackManager.GetPaymentByPublicStringId({
            paymentId: notififation.label,
            expectedProvider: EPaymentOptionProviderId.RU_YOOMONEY
        });

        if (!payment) {
            throw 'NEW payment not found in DB';
        }

        const paymentOption = await PaymentCallBackManager.GetPaymentOption({
            key: {
                botUUID: payment.botUUID,
                masterId: payment.masterId,
                id: payment.paymentOptionId
            },
            expectedProvider: EPaymentOptionProviderId.RU_YOOMONEY
        });

        if (!paymentOption) {
            throw 'paymentOption not found or invalid';
        }

        const secretKey = (paymentOption.type as IPaymentOptionType_RU_YOOMONEY).token;

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

        //если дошли сюда то у нас на руках есть подтверденный от юмани
        //теперь надо его запустить в процессинг

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
