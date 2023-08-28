import CryptoJS from 'crypto-js';

import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';

//@ts-ignore
import { ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PaymentOptionManager } from '/opt/PaymentOptionManager';
//@ts-ignore
import { PaymentManager } from '/opt/PaymentManager';

import { TextHelper } from '/opt/TextHelpers/textHelper';
import { EPaymentOptionProviderId, EPaymentStatus, ESupportedCurrency, IPaymentOptionKey, IPaymentOptionType_RU_ROBOKASSA } from 'tgbot-project-types/TypesCompiled/paymentTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { IBotGeneralKey, ILooseString } from 'tgbot-project-types/TypesCompiled/generalTypes';
import axios, { AxiosRequestConfig } from 'axios';

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

        const payment = await PaymentManager.GetPaymentRequestForPublicByStringId(paymentKey);

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
        const paymentOption = await PaymentOptionManager.GetMyPaymentOptionById(paymentOptionKey);

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

        switch (paymentOption.data.type.optionProviderId) {
            case EPaymentOptionProviderId.RU_ROBOKASSA: {
                const decyptedPaymentOption = await PaymentOptionManager.GetDecryptedPaymentOption(paymentOptionKey);

                if (decyptedPaymentOption.success == false || !decyptedPaymentOption.data) {
                    const error = 'Error: decrypted data not found';
                    console.log(error);
                    return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
                }
                const password1 = (decyptedPaymentOption.data.type as IPaymentOptionType_RU_ROBOKASSA).password1;

                let hashString = '';
                if (payment.currency == ESupportedCurrency.RUB) {
                    hashString = `${paymentOption.data.type.shopId}:${payment.price.toString()}:${payment.paymentOrderN}:${password1}`;
                } else {
                    hashString = `${paymentOption.data.type.shopId}:${payment.price.toString()}:${payment.paymentOrderN}:${payment.currency}:${password1}`;
                }

                const hash = CryptoJS.MD5(hashString).toString();
                additionalParams.SignatureValue = hash;
                break;
            }
            case EPaymentOptionProviderId.CRYPTOCLOUD_PLUS: {
                //'https://api.cryptocloud.plus/v1/invoice/create \'
                try {
                    const prodiderDetails = paymentOption.data.type;
                    const url = 'https://api.cryptocloud.plus/v1/invoice/create';

                    const axiosConfig: AxiosRequestConfig<any> = {};

                    axiosConfig.withCredentials = true;
                    axiosConfig.headers = {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${prodiderDetails.APIKEY}`
                    };
                    const itemData = {
                        shop_id: prodiderDetails.shopId,
                        amount: payment.price,
                        order_id: payment.id,
                        currency: payment.currency
                    };

                    const result = await axios.post(url, JSON.stringify(itemData), { ...axiosConfig });
                    console.log(result.data);
                    if (result.data?.status == 'success' && result.data.day_url) {
                        additionalParams.pay_url = result.data.day_url;
                    }
                } catch (error) {
                    console.log(error);
                    return ReturnBlankApiResult(422, { success: false, data: { error: JSON.stringify(error) } }, origin);
                }
                break;
            }
        }

        return ReturnBlankApiResult(200, { data: { paymentDetails: payment, paymentOption: paymentOption.data, botName: bot.data.name, additionalParams: additionalParams } }, origin);
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(403, { success: false, data: { error: error } }, '');
    }
}
