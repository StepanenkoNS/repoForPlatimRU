import CryptoJS from 'crypto-js';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { PaymentManager } from '/opt/PaymentManager';

import { EPaymentStatus } from 'tgbot-project-types/TypesCompiled/paymentTypes';
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

//отличия ветки CallBack_pompona от базовой:
//1. Хэши и секретные ключи методов оплаты хранятся в переменных окружения (неплохо бы их в секреты перенести)
//2. Поэтому мы и не делаем запрос в payment_option
//3. мы не запускаем sqs на обработку платежа, а делаем все внутри лямбды

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const params = new URLSearchParams(event.body ? event.body : '');

        const notififation = Object.fromEntries(params.entries());

        //нам не надо никуда идти в бащу за секретным ключом - тк это не payment_option, она лежит в env_var
        const modulKey = process.env.modulKey!;

        const signature = PaymentCallBackManager.GetModulSignature(modulKey, notififation);

        if (signature !== notififation.signature) {
            throw 'Error: signature is invalid';
        }

        const paymentInDb = await PaymentManager.ConfirmPomponaPayment({
            masterId: Number(notififation.client_id),
            paymentId: notififation.order_id,
            transactionId: notififation.transaction_id,
            gatewayId: 'modulBank',
            paymentResult: notififation.state == 'COMPLETE' ? EPaymentStatus.CONFIRMED : EPaymentStatus.REJECTED,
            externalDetails: {
                dt: new Date().toISOString(),
                externalJSON: JSON.stringify(notififation)
            }
        });

        if (paymentInDb.success == false || !paymentInDb.data) {
            throw 'no payment in DB';
        }

        const result = await PomponaSubscriptionsProcessor.AddSubscription({
            masterId: paymentInDb.data.masterId,
            lengthInDays: paymentInDb.data.lengthInDays,
            subscriptionPlan: paymentInDb.data.subscriptionPlan,
            pricePaid: paymentInDb.data.price,
            currency: paymentInDb.data.currency
        });

        if (result.success == false || !result.data) {
            throw 'cant add subscription';
        }

        return ReturnBlankApiResult(201, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(201, { success: true }, '');
    }
}
