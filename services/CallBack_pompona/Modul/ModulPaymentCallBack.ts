import CryptoJS from 'crypto-js';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { PaymentManager } from '/opt/PaymentManager';

import { EPaymentStatus } from 'tgbot-project-types/TypesCompiled/paymentTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const queryString = event.body ? event.body : '';
        const params = new URLSearchParams(queryString);

        const paramObject = Object.fromEntries(params.entries());
        const modulKey = process.env.modulKey!;

        const signature = PomponaSubscriptionsProcessor.GetSignature(modulKey, paramObject, 'signature');

        if (signature == paramObject.signature) {
            const paymentInDb = await PaymentManager.ConfirmPomponaPayment({
                masterId: Number(paramObject.client_id),
                paymentId: paramObject.order_id,
                transactionId: paramObject.transaction_id,
                gatewayId: 'modulBank',
                paymentResult: paramObject.state == 'COMPLETE' ? EPaymentStatus.CONFIRMED : EPaymentStatus.REJECTED,
                externalDetails: {
                    dt: new Date().toISOString(),
                    externalJSON: JSON.stringify(paramObject)
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
        } else {
            throw 'Error: signature is invalid';
        }

        return ReturnBlankApiResult(201, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(201, { success: true }, '');
    }
}
