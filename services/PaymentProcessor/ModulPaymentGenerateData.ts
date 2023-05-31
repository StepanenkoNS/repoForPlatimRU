import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguages } from '/opt/LocaleTypes';
import { GetLandingSubdomainFromOrigin, SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore

import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
import { BotLanging } from '/opt/BotLanding';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { IModulPaymentRequest, IModulReceiptItem } from '/opt/PaymentTypes';
import axios from 'axios';
import ksuid from 'ksuid';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log('event', JSON.stringify(event));
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    const item: IModulReceiptItem = {
        name: 'Подписка Pompona - канал',
        quantity: 1,
        price: 1000,
        sno: 'patent',
        payment_object: 'service',
        payment_method: 'full_payment',
        vat: 'none'
    };

    const modulMerchantId = '46e90f0c-76da-4646-81ab-8890763b4316';
    const success_url = 'https://admin.pompona.net/successfullPayment';
    const callback_url = 'https://payments.pompona.net/modul_ru/callback';

    const unix_timestamp = new Date().getTime();

    const order_id = ksuid.randomSync(new Date()).string; //paymentId
    const clientId = Number(telegramUser.id).toString();
    const description = 'Оплата подписки Pompona';

    const payment: IModulPaymentRequest = {
        merchant: modulMerchantId,
        amount: item.price * item.quantity,
        order_id: order_id,
        salt: '3CGHd627HOLjPeyeALcEwxm8O7dqru4A',
        description: description,
        success_url: success_url,
        testing: 1,
        callback_url: callback_url,
        receipt_items: [item],
        unix_timestamp: unix_timestamp,
        client_id: clientId
    };
    const result = await PomponaSubscriptionsProcessor.GenerateModulPayment(payment);

    const getResult = ParseItemResult(result);
    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
