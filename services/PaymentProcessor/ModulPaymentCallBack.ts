import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const queryString = event.body ? event.body : '';
        const params = new URLSearchParams(queryString);

        const paramObject = Object.fromEntries(params.entries());
        const modulKey = process.env.modulKey!;

        const signature = PomponaSubscriptionsProcessor.GetSignature(modulKey, paramObject);

        if (signature == paramObject.signature) {
            console.log('success');
            const paymentInDb = await PaymentOptionsManager.ConfirmPomponaPayment({
                masterId: Number(paramObject.client_id),
                paymentId: paramObject.order_id,
                transactionId: paramObject.transaction_id,
                gatewayId: 'modulBank',
                paymentResult: paramObject.state == 'COMPLETE' ? 'CONFIRMED' : 'REJECTED'
            });

            if (paymentInDb.success == false || !paymentInDb.data) {
                throw 'no payment in DB';
            }

            const result = await PomponaSubscriptionsProcessor.AddSubscription({
                masterId: paymentInDb.data.masterId,
                lengthInDays: paymentInDb.data.lengthInDays,
                subscriptionPlan: paymentInDb.data.subscriptionPlan,
                subscriptionLevel: paymentInDb.data.subscriptionLevel,
                pricePaid: paymentInDb.data.price,
                currency: paymentInDb.data.currency
            });

            if (result.success == false || !result.data) {
                throw 'cant add subscription';
            }
        }

        return ReturnBlankApiResult(201, { success: true });
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(201, { success: true });
    }
}
