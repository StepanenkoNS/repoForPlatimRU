import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { MessagingBotManager } from '/opt/MessagingBotManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [{ key: 'id', datatype: 'number(nonZeroPositiveInteger)' }]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const limitsValidationResult = await ZuzonaSubscriptionsProcessor.CheckSubscription_AddBot({
        masterId: Number(telegramUser.id),

        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return ReturnRestApiResult(422, { error: 'not valid subscription data' }, false, origin, renewedToken);
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return ReturnRestApiResult(429, { error: 'Subscription plan limits exceeded' }, false, origin, renewedToken);
    }
    const result = await MessagingBotManager.SetWebhook(Number(telegramUser.id), Number(TextHelper.SanitizeToDirectText(bodyObject.data.id)));

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
