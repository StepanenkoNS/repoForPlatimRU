import CryptoJS from 'crypto-js';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { PaymentManager } from '/opt/PaymentManager';

import { EPaymentOptionProviderId, EPaymentStatus, IPaymentOptionType_RU_MODUL, IPaymentOptionType_RU_YOOMONEY } from 'tgbot-project-types/TypesCompiled/paymentTypes';
//@ts-ignore
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const params = new URLSearchParams(event.body ? event.body : '');

        const notififation = Object.fromEntries(params.entries());

        const payment = await PaymentCallBackManager.GetPaymentByPublicStringId({
            paymentId: notififation.order_id,
            expectedProvider: EPaymentOptionProviderId.RU_MODUL
        });
        if (!payment) {
            throw 'payment not found';
        }

        const paymentOption = await PaymentCallBackManager.GetPaymentOption({
            key: {
                botUUID: payment.botUUID,
                masterId: payment.masterId,
                id: payment.paymentOptionId
            },
            expectedProvider: EPaymentOptionProviderId.RU_MODUL
        });

        if (!paymentOption) {
            throw 'paymentOption not found or invalid';
        }

        const secretKey = (paymentOption.type as IPaymentOptionType_RU_MODUL).token;

        const signature = PaymentCallBackManager.GetModulSignature(secretKey, notififation);

        if (signature !== notififation.signature) {
            throw 'Error:hash mistmach';
        }

        if (notififation.state !== 'COMPLETE') {
            //выходим, тк пришел отклоненный платеж
            return ReturnBlankApiResult(201, { success: true }, '');
        }

        const sqsResult = await PaymentCallBackManager.QueuePaymentProcessing({
            payment: payment,
            externalData: notififation
        });

        if (sqsResult == false) {
            throw 'Error: Failed to queuee';
        }

        return ReturnBlankApiResult(201, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(201, { success: true }, '');
    }
}
