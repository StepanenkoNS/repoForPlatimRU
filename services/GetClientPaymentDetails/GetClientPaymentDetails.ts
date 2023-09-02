import CryptoJS from 'crypto-js';
import { ESupportedLanguage } from 'tgbot-project-types/TypesCompiled/localeTypes';

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
import { IMessagingBot, IAddMessagingBot, IMessagingBot_DDB, IUserBotProfile } from 'tgbot-project-types/TypesCompiled/messagingBotManagerTypes';

import { TextHelper } from '/opt/TextHelpers/textHelper';
import {
    EPaymentOptionProviderId,
    EPaymentStatus,
    ESupportedCurrency,
    IClientPaymentDetails,
    IModulPaymentRequest,
    IPaymentOption,
    IPaymentOptionKey,
    IPaymentOptionType_RU_MODUL_SendReceiptLong,
    IPaymentOptionType_RU_ROBOKASSA
} from 'tgbot-project-types/TypesCompiled/paymentTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { DefaultDates, DefaultPeriods, EEnvironment, IBotGeneralKey, IBotGeneralKeyWithUser, ILooseString } from 'tgbot-project-types/TypesCompiled/generalTypes';
import axios, { AxiosRequestConfig } from 'axios';
import { PaymentCallBackManager } from '/opt/PaymentCallBackManager';
import { MessagingBotUser } from '/opt/MessagingBotUser';

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

        const paymentExpitartionDate = new Date(payment.paymentInitTime);
        paymentExpitartionDate.setTime(paymentExpitartionDate.getTime() + Number(process.env.userPaymentExpirationTimeInMinutes) * DefaultPeriods.oneMinute);

        if (paymentExpitartionDate.getTime() <= new Date().getTime()) {
            const retData: IClientPaymentDetails = {
                paymentIsExpired: true,
                paymentDetails: payment
            };
            return ReturnBlankApiResult(200, { data: retData }, origin);
        }

        const promises = [];

        const paymentOptionKey: IPaymentOptionKey = {
            masterId: payment.masterId,
            botUUID: payment.botUUID,
            id: payment.paymentOptionId
        };
        const tempPaymentOptionPromise = PaymentOptionManager.GetDecryptedPaymentOption(paymentOptionKey);

        promises.push(tempPaymentOptionPromise);

        const botKey: IBotGeneralKey = {
            masterId: payment.masterId,
            botUUID: payment.botUUID
        };

        const botPromise = MessagingBotManager.GetMyBot(botKey);
        promises.push(botPromise);

        const userKey: IBotGeneralKeyWithUser = {
            masterId: payment.masterId,
            botUUID: payment.botUUID,
            chatId: payment.chatId
        };

        const userPromise = MessagingBotUser.GetBotUser(userKey);
        promises.push(userPromise);

        const promisesResult = await Promise.all(promises);

        if (promisesResult[0].success == false || !promisesResult[0].data) {
            const error = 'Error: paymentOption data not found';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        const paymentOption = promisesResult[0].data as unknown as IPaymentOption;

        if (paymentOption.type.optionProviderId !== payment.optionProviderId) {
            throw 'Error: Payment and PaymentOption providers does not match';
        }

        if (promisesResult[1].success == false || !promisesResult[1].data) {
            const error = 'Error: bot not found';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        const bot = promisesResult[1].data as unknown as IMessagingBot;

        if (promisesResult[2].success == false || !promisesResult[2].data) {
            const error = 'Error: user not found';
            console.log(error);
            return ReturnBlankApiResult(422, { success: false, data: { error: error } }, origin);
        }

        const user = promisesResult[2].data as unknown as IUserBotProfile;

        let additionalParams: ILooseString = {};

        const userLocale = user.menuLanguage == ESupportedLanguage.ru ? ESupportedLanguage.ru : ESupportedLanguage.en;

        switch (paymentOption.type.optionProviderId) {
            case EPaymentOptionProviderId.RU_YOOMONEY: {
                additionalParams.walletId = paymentOption.type.walletId;
                break;
            }

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
                additionalParams.shopId = paymentOption.type.shopId;
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
                    salt: bot.id,
                    description: payment.paymentTarget,
                    success_url: `https://t.me/${bot.name}`,
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
                additionalParams.shopId = paymentOption.type.shopId;

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

            case EPaymentOptionProviderId.RU_PLATIM: {
                try {
                    const providerDetails = paymentOption.type;
                    const url = 'https://api.test.paydev.ru/api/v1/store/invoice';
                    //const url = 'https://api.platim.ru/api/v1/store/invoice';

                    const axiosConfig: AxiosRequestConfig<any> = {};
                    //axiosConfig.withCredentials = true;
                    axiosConfig.headers = {
                        accept: 'application/json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${providerDetails.token}`
                    };
                    const itemData = {
                        goods: [
                            {
                                name: payment.paymentTarget,
                                nameEn: payment.paymentTarget,
                                description: payment.paymentTarget,
                                currency: payment.currency,
                                price: (payment.price * 100).toString(),
                                quantity: '1',
                                shopItemId: payment.id
                            }
                        ],
                        //invoicePriceFixed: true,
                        shopOrderId: payment.id,
                        successUrl: `https://t.me/${bot.name}`,
                        notificationUrl: `https://payments.${process.env.mainDomainName}/callback/platim_ru`,
                        formLocale: userLocale.toString()
                    };

                    const stringified = JSON.stringify(itemData);

                    console.log('data to send from platim.ru', itemData);

                    const result = await axios.post(url, stringified, { ...axiosConfig });

                    console.log('received data from platim.ru', result.data);
                    if (result.data && result.data.payFormUrl) {
                        additionalParams = {
                            payFormUrl: result.data.payFormUrl
                        };
                    }
                } catch (error) {
                    console.log(error);
                    return ReturnBlankApiResult(422, { success: false, data: { error: JSON.stringify(error) } }, origin);
                }
                break;
            }
        }

        const retData: IClientPaymentDetails = {
            paymentIsExpired: false,
            paymentDetails: payment,
            botName: bot.name,
            additionalParams: additionalParams,
            userLocale: userLocale
        };

        return ReturnBlankApiResult(200, { success: true, data: retData }, origin);
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(403, { success: false, data: { error: error } }, '');
    }
}
