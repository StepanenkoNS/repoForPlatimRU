import { TextHelper } from 'opt/TextHelpers/textHelper';
//@ts-ignore
import { SchemaValidator } from 'opt/YUP/SchemaValidator';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { IMessagingBot } from 'opt/MessagingBotManagerTypes';
//@ts-ignore
import { MessagingBotManager } from 'opt/MessagingBotManager';
//@ts-ignore
import { PomponaSubscriptionsProcessor } from 'opt/PomponaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event.body);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'token', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (TextHelper.SanitizeToDirectText(bodyObject.data.token).trim() == '') {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'Token is empty' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }
    const potentialBot: IMessagingBot = {
        masterId: Number(telegramUser.id),
        token: TextHelper.SanitizeToDirectText(bodyObject.data.token),
        id: Number(TextHelper.SanitizeToDirectText(bodyObject.data.id))
    };

    const validationResult = await SchemaValidator.Bot_Validation(potentialBot);
    if (validationResult.success == false || !validationResult.item) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: validationResult.error },
            withMapReplacer: false,
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
            data: { success: false, error: validationResult.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return await ReturnRestApiResult({
            statusCode: 429,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: validationResult.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await MessagingBotManager.AddMyBot(validationResult.item);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ADD',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
