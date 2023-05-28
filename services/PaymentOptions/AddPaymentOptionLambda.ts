import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { EPaymentOptionType, IPaymentOption } from '/opt/PaymentTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';
import { ItemResponse } from '/opt/GeneralTypes';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';
import { ZuzonaSubscriptionsProcessor } from '/opt/ZuzonaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 'type', datatype: 'object', objectKeys: [] },
        { key: 'currency', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    const potentialPaymentOption: IPaymentOption = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        type: bodyObject.data.type,
        currency: TextHelper.SanitizeToDirectText(bodyObject.data.currency) as any
    };

    const schemaValidationResult = await SchemaValidator.PaymentOption_Validator(potentialPaymentOption);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return ReturnRestApiResult(422, { error: JSON.stringify(schemaValidationResult.error) }, false, origin, renewedToken);
    }

    const limitsValidationResult = await ZuzonaSubscriptionsProcessor.CheckSubscription_AddPaymentOtion({
        key: {
            masterId: schemaValidationResult.item.masterId,
            botId: schemaValidationResult.item.botId
        },
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return ReturnRestApiResult(422, { error: 'not valid subscription data' }, false, origin, renewedToken);
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return ReturnRestApiResult(429, { error: 'Subscription plan limits exceeded' }, false, origin, renewedToken);
    }

    const result = await PaymentOptionsManager.AddPaymentOption(schemaValidationResult.item as any);

    const addResult = ParseItemResult(result);
    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
