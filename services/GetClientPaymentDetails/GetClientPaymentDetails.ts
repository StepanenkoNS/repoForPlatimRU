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
import { EPaymentOptionProviderId, EPaymentStatus, IPaymentOptionKey, IPaymentOptionType_RU_ROBOKASSA } from 'tgbot-project-types/TypesCompiled/paymentTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { IBotGeneralKey, ILooseString } from 'tgbot-project-types/TypesCompiled/generalTypes';

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
            const error = 'Error: paymentOption data not found';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        const botKey: IBotGeneralKey = {
            masterId: payment.masterId,
            botUUID: payment.botUUID
        };

        const bot = await MessagingBotManager.GetMyBot(botKey);

        if (bot.success == false || !bot.data) {
            const error = 'Error: bot not found';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        let additionalParams: ILooseString = {};
        if (paymentOption.data.type.optionProviderId == EPaymentOptionProviderId.RU_ROBOKASSA) {
            const decyptedPaymentOption = await PaymentOptionsManager.GetDecryptedPaymentOption(paymentOptionKey);

            if (decyptedPaymentOption.success == false || !decyptedPaymentOption.data) {
                const error = 'Error: decrypted data not found';
                console.log(error);
                return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
            }
            const password1 = (decyptedPaymentOption.data.type as IPaymentOptionType_RU_ROBOKASSA).password1;
            const hashString = `${paymentOption.data.type.shopId}:${payment.price.toString()}::${password1}`;
            const hash = CryptoJS.MD5(hashString).toString();
            additionalParams.SignatureValue = hash;
        }

        return ReturnBlankApiResult(200, { data: { paymentDetails: payment, paymentOption: paymentOption.data, botName: bot.data.name, additionalParams: additionalParams } }, origin);
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(403, { success: false, data: { error: error } }, '');
    }
}
