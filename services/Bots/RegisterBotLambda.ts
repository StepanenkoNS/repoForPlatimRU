import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { MessagingBotManager } from '/opt/MessagingBotManager';
import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [{ key: 'id', datatype: 'number(nonZeroPositiveInteger)' }]);
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

    const botId = Number(TextHelper.SanitizeToDirectText(bodyObject.data.id));
    const limitsValidationResult = await PomponaSubscriptionsProcessor.CheckSubscription_AddBot({
        masterId: Number(telegramUser.id),
        botId: botId,
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'not valid subscription data' },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return await ReturnRestApiResult({
            statusCode: 429,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'Subscription plan limits exceeded' },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await MessagingBotManager.SetWebhook(Number(telegramUser.id), botId);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'EDIT',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
