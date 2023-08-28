import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { PaymentOptionManager } from '/opt/PaymentOptionManager';

import { EPaymentStatus } from 'tgbot-project-types/TypesCompiled/paymentTypes';

export async function handler(): Promise<APIGatewayProxyResult> {
    try {
        const paymentInDb = await PaymentOptionManager.ConfirmPomponaPayment({
            masterId: 1862254,
            paymentId: '2UPFCGCZJZRoE8AseWfkhR8dsJh',
            transactionId: 'admin_payment',
            gatewayId: 'modulBank',
            paymentResult: EPaymentStatus.CONFIRMED
        });

        if (paymentInDb.success == false || !paymentInDb.data) {
            throw 'no payment in DB';
        }

        const result = await PomponaSubscriptionsProcessor.AddSubscription({
            masterId: paymentInDb.data.masterId,
            lengthInDays: paymentInDb.data.lengthInDays,
            subscriptionPlan: paymentInDb.data.subscriptionPlan,
            userName: 'radiojoy',

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

async function main() {
    await handler();
}

main();
