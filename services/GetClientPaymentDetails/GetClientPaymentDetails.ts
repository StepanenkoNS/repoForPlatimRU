import CryptoJS from 'crypto-js';

import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';

//@ts-ignore
import { ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

import { TextHelper } from '/opt/TextHelpers/textHelper';
import { EPaymentStatus, IPaymentOptionKey } from 'tgbot-project-types/TypesCompiled/paymentTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));
        let origin = SetOrigin(event);

        if (!ValidateStringParameters(event, ['paymentId', 'hash'])) {
            const error = 'ValidateStringParameters error';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        const paymentKey = {
            paymentId: TextHelper.SanitizeToDirectText(event.queryStringParameters!.paymentId!),
            hash: TextHelper.SanitizeToDirectText(event.queryStringParameters!.hash!)
        };

        const hash = CryptoJS.SHA1(paymentKey.paymentId + process.env.openDataHashKey!).toString(CryptoJS.enc.Hex);
        //const hash = CryptoJS.AES.encrypt(paymentKey.paymentId, process.env.openDataHashKey!).toString(CryptoJS.format.Hex);

        if (hash !== paymentKey.hash) {
            console.log('paymentKey', paymentKey);
            console.log('hash', hash);

            const error = 'hash for the paymentId is invalid';
            console.log(error);
            return ReturnBlankApiResult(403, { success: false, data: { error: error } }, origin);
        }

        const payment = await PaymentOptionsManager.GetPaymentRequestForPublic(paymentKey);

        if (!payment) {
            const error = 'Error: new payment not found';
            console.log(error);
            return ReturnBlankApiResult(403, { success: false, data: { error: error } }, origin);
        }

        const paymentOptionKey: IPaymentOptionKey = {
            masterId: payment.masterId,
            botUUID: payment.botUUID,
            id: payment.paymentOptionId
        };
        const paymentOption = await PaymentOptionsManager.GetMyPaymentOptionById(paymentOptionKey);

        if (paymentOption.success == false || !paymentOption.data) {
            return ReturnBlankApiResult(422, { success: false, data: { error: 'Error: paymentOption data not found' } }, origin);
        }

        return ReturnBlankApiResult(200, { data: { paymentDetails: payment, paymentOption: paymentOption.data } }, origin);
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(403, { success: false, data: { error: error } }, '');
    }
}
