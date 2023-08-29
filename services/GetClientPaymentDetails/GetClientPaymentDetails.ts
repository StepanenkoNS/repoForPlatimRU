import CryptoJS from 'crypto-js';

import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
import { IdHelper } from 'tgbot-project-types/TypesCompiled/nanoIdTypes';

//@ts-ignore
import { ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PaymentOptionManager } from '/opt/PaymentOptionManager';
//@ts-ignore
import { PaymentManager } from '/opt/PaymentManager';

import { TextHelper } from '/opt/TextHelpers/textHelper';
import {
    EPaymentOptionProviderId,
    ESupportedCurrency,
    IModulPaymentRequest,
    IPaymentOptionKey,
    IPaymentOptionType_RU_MODUL_SendReceiptLong,
    IPaymentOptionType_RU_ROBOKASSA
} from 'tgbot-project-types/TypesCompiled/paymentTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { DefaultDates, DefaultPeriods, EEnvironment, IBotGeneralKey, ILooseString } from 'tgbot-project-types/TypesCompiled/generalTypes';
import axios, { AxiosRequestConfig } from 'axios';
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';

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
        const tempPaymentOption = await PaymentOptionManager.GetDecryptedPaymentOption(paymentOptionKey);

        if (tempPaymentOption.success == false || !tempPaymentOption.data) {
            const error = 'Error: paymentOption data not found';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        const paymentOption = tempPaymentOption.data;

        if (paymentOption.type.optionProviderId !== payment.optionProviderId) {
            throw 'Error: Payment and PaymentOption providers does not match';
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

        switch (paymentOption.type.optionProviderId) {
            case EPaymentOptionProviderId.RU_ROBOKASSA: {
                const password1 = (paymentOption.type as IPaymentOptionType_RU_ROBOKASSA).password1;

                let hashString = '';
                if (payment.currency == ESupportedCurrency.RUB) {
                    hashString = `${paymentOption.type.shopId}:${payment.price.toString()}:${payment.paymentOrderN}:${password1}`;
                } else {
                    hashString = `${paymentOption.type.shopId}:${payment.price.toString()}:${payment.paymentOrderN}:${payment.currency}:${password1}`;
                }

                const hash = CryptoJS.MD5(hashString).toString();
                additionalParams.SignatureValue = hash;
                break;
            }
            case EPaymentOptionProviderId.CRYPTOCLOUD_PLUS: {
                //'https://api.cryptocloud.plus/v1/invoice/create \'
                try {
                    const prodiderDetails = paymentOption.type;
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
                    if (result.data?.status == 'success' && result.data.pay_url) {
                        additionalParams = {
                            pay_url: result.data.pay_url,
                            currency: result.data.currency,
                            invoice_id: result.data.invoice_id,
                            amount: result.data.amount,
                            amount_usd: result.data.amount_usd
                        };
                    }
                } catch (error) {
                    console.log(error);
                    return ReturnBlankApiResult(422, { success: false, data: { error: JSON.stringify(error) } }, origin);
                }
                break;
            }
            case EPaymentOptionProviderId.RU_MODUL: {
                const prodiderDetails = paymentOption.type;

                let item: IPaymentOptionType_RU_MODUL_SendReceiptLong | undefined = undefined;

                if (paymentOption.type.sendReceipt) {
                    item = {
                        name: payment.paymentTarget,
                        quantity: 1,
                        price: payment.price,
                        sno: paymentOption.type.sendReceipt.sno,

                        payment_object: paymentOption.type.sendReceipt.payment_object,
                        payment_method: 'full_payment',
                        vat: paymentOption.type.sendReceipt.vat
                    };
                }

                const modulPayment: IModulPaymentRequest = {
                    merchant: prodiderDetails.shopId,
                    amount: payment.price * 1,
                    order_id: payment.id,
                    salt: bot.data.id,
                    description: payment.paymentTarget,
                    success_url: `https://t.me/${bot.data.name}`,
                    testing: process.env.environmentKey == EEnvironment.prod ? 0 : 1,
                    callback_url: `https://payments.${process.env.mainDomainName}/callback/modul`,
                    receipt_items: item ? [item] : undefined,
                    unix_timestamp: Math.floor(DefaultDates.epochFromDate() / DefaultPeriods.oneSecond),
                    client_id: payment.chatId.toString()
                };

                const modulKey = paymentOption.type.token;
                const result = PaymentCallBackManager.SignModulPayment(modulPayment, modulKey);
                if (result.success == false || !result.data) {
                    throw 'Error:PaymentCallBackManager.SignModulPayment failed';
                }
                additionalParams = { ...result.data };

                break;
            }
        }

        return ReturnBlankApiResult(200, { data: { paymentDetails: payment, paymentOption: paymentOption, botName: bot.data.name, additionalParams: additionalParams } }, origin);
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(403, { success: false, data: { error: error } }, '');
    }
}
