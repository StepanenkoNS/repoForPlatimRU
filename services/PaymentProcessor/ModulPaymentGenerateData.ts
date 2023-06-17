import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { GetLandingSubdomainFromOrigin, SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore

import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
import { BotLanging } from '/opt/BotLanding';
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';
import { IModulPaymentRequest, IModulReceiptItem, SupportedCurrenciesArray } from 'tgbot-project-types/TypesCompiled/PaymentTypes';
import axios from 'axios';
import ksuid from 'ksuid';
import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';
import { IPomponaAddSubscription } from 'tgbot-project-types/TypesCompiled/MasterManagerTypes';
import { SchemaValidator } from '/opt/YUP/SchemaValidator';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log('event', JSON.stringify(event));
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    try {
        let bodyObject = ValidateIncomingEventBody(event, [
            { key: 'lengthInDays', datatype: 'number(positiveInteger)' },
            { key: 'subscriptionPlan', datatype: ['PAIDCHANNEL', 'PAIDBOT', 'BASIC'] },
            { key: 'subscriptionLevel', datatype: 'number(positiveInteger)' },
            { key: 'pricePaid', datatype: 'number(positiveInteger)' },
            { key: 'currency', datatype: SupportedCurrenciesArray }
        ]);
        if (bodyObject.success === false) {
            return await ReturnRestApiResult({
                statusCode: 422,
                method: 'EDIT',
                masterId: Number(telegramUser.id),
                data: { success: false, error: bodyObject.error },

                origin: origin,
                renewedAccessToken: renewedToken
            });
        }

        const potentialSubscription: IPomponaAddSubscription = {
            masterId: Number(telegramUser.id),
            lengthInDays: Number(TextHelper.SanitizeToDirectText(bodyObject.data.lengthInDays)),
            subscriptionPlan: TextHelper.SanitizeToDirectText(bodyObject.data.subscriptionPlan) as any,
            subscriptionLevel: Number(TextHelper.SanitizeToDirectText(bodyObject.data.subscriptionLevel)),
            pricePaid: Number(TextHelper.SanitizeToDirectText(bodyObject.data.pricePaid)),
            currency: TextHelper.SanitizeToDirectText(bodyObject.data.currency) as any
        };

        const schemaValidationResult = await SchemaValidator.PomponaSubscriptionPaymentValidator(potentialSubscription);
        if (schemaValidationResult.success == false || !schemaValidationResult.item) {
            return await ReturnRestApiResult({
                statusCode: 422,
                method: 'EDIT',
                masterId: Number(telegramUser.id),
                data: { success: false, error: schemaValidationResult.error },

                origin: origin,
                renewedAccessToken: renewedToken
            });
        }

        const paymentInDb = await PaymentOptionsManager.AddPomponaPayment(schemaValidationResult.item as any, 'modulBank');
        if (paymentInDb.success == false || !paymentInDb.data) {
            throw 'error';
        }

        const item: IModulReceiptItem = {
            name: 'Pompona Subscription - ' + schemaValidationResult.item.subscriptionPlan,
            quantity: 1,
            price: schemaValidationResult.item.pricePaid,
            sno: 'patent',
            payment_object: 'service',
            payment_method: 'full_payment',
            vat: 'none'
        };

        const modulMerchantId = process.env.modulMerchantId!;
        //
        const modulSuccess_url = process.env.modulSuccess_url!;
        //const modulSuccess_url = 'https://pay.modulbank.ru/success';

        const modulCallback_url = process.env.modulCallback_url!;

        const modulKey = process.env.modulKey!;

        const unix_timestamp = new Date().getTime();

        const order_id = paymentInDb.data.id!;
        const clientId = Number(telegramUser.id).toString();
        const description = 'Pompona Subscription payment';

        const payment: IModulPaymentRequest = {
            merchant: modulMerchantId,
            amount: item.price * item.quantity,
            order_id: order_id,
            salt: ksuid.randomSync(new Date()).string,
            description: description,
            success_url: modulSuccess_url,
            testing: 1,
            callback_url: modulCallback_url,
            receipt_items: [item],
            unix_timestamp: unix_timestamp,
            client_id: clientId
        };
        const result = await PomponaSubscriptionsProcessor.GenerateModulPayment(payment, modulKey);

        const dataResult = ParseItemResult(result);

        return await ReturnRestApiResult({
            statusCode: dataResult.code,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: dataResult.body,

            origin: origin,
            renewedAccessToken: renewedToken
        });
    } catch (error) {
        console.log(error);

        return await ReturnRestApiResult({
            statusCode: 503,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: { success: false, error: error },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }
}
