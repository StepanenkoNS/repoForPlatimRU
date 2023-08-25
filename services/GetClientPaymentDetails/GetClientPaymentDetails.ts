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

        if (!ValidateStringParameters(event, ['masterId', 'botUUID', 'paymentId'])) {
            return ReturnBlankApiResult(422, { success: false, data: undefined }, origin);
        }

        const paymentKey = {
            masterId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.masterId!)),
            botUUID: TextHelper.SanitizeToDirectText(event.queryStringParameters!.botUUID!),
            paymentId: TextHelper.SanitizeToDirectText(event.queryStringParameters!.paymentId!)
        };

        const payment = await PaymentOptionsManager.GetPaymentRequestForPublic(paymentKey);

        if (!payment) {
            throw 'Error: invalid payment';
        }

        const paymentOptionKey: IPaymentOptionKey = {
            masterId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.masterId!)),
            botUUID: TextHelper.SanitizeToDirectText(event.queryStringParameters!.botUUID!),
            id: payment.paymentOptionId
        };
        const paymentOption = await PaymentOptionsManager.GetMyPaymentOptionById(paymentOptionKey);

        if (paymentOption.success == false || !paymentOption.data) {
            throw `Error: paymentOption data not found`;
        }

        return ReturnBlankApiResult(201, { data: { paymentDetails: payment, paymentOption: paymentOption.data } }, origin);
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(503, { success: false, data: undefined }, '');
    }
}
