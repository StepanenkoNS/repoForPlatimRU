import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import CryptoJS from 'crypto-js';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { createHash, createHmac, timingSafeEqual } from 'crypto';

import {
    EPaymentOptionProviderId,
    IPaymentOptionType_CRYPTOBOT,
    IPaymentOptionType_RU_YOOMONEY,
    IYooMoneyNotification,
    IYooMoneyNotificationAndSecret
} from 'tgbot-project-types/TypesCompiled/paymentTypes';

import { PaymentManager } from '/opt/PaymentManager';
import { PaymentOptionManager } from '/opt/PaymentOptionManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';

import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const checkSignature = (props: { token: string; body: string; signature: string }) => {
        const secret = createHash('sha256').update(props.token).digest();
        const checkString = props.body; // JSON.stringify(props.body);
        const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
        return hmac === props.signature;
    };

    try {
        console.log('event', JSON.stringify(event));
        if (!event.body) {
            throw 'event body is not defined';
        }

        const notififation = JSON.parse(event.body!);

        const paymentId = JSON.parse(notififation.payload.payload).paymentId;

        const payment = await PaymentCallBackManager.GetPaymentByPublicStringId({
            paymentId: paymentId,
            expectedProvider: EPaymentOptionProviderId.CRYPTOBOT
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
            expectedProvider: EPaymentOptionProviderId.CRYPTOBOT
        });

        if (!paymentOption) {
            throw 'paymentOption not found or invalid';
        }

        const secretKey = (paymentOption.type as IPaymentOptionType_CRYPTOBOT).token;

        const signatureValidtationResult = checkSignature({ token: secretKey, body: event.body, signature: event.headers['crypto-pay-api-signature']! });

        if (signatureValidtationResult == false) {
            return ReturnBlankApiResult(401, { success: false }, '');
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
