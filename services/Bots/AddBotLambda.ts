import { TextHelper } from '/opt/TextHelpers/textHelper';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { IMessagingBot } from '/opt/MessagingBotManagerTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';
//@ts-ignore
import { ZuzonaSubscriptionsProcessor } from '/opt/ZuzonaSubscriptionsProcessor';

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
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    if (TextHelper.SanitizeToDirectText(bodyObject.data.token).trim() == '') {
        return ReturnRestApiResult(422, { error: 'Token is empty' }, false, origin, renewedToken);
    }
    const potentialBot: IMessagingBot = {
        masterId: Number(telegramUser.id),
        token: TextHelper.SanitizeToDirectText(bodyObject.data.token),
        id: Number(TextHelper.SanitizeToDirectText(bodyObject.data.id))
    };

    const validationResult = await SchemaValidator.Bot_Validation(potentialBot);
    if (validationResult.success == false || !validationResult.item) {
        return ReturnRestApiResult(422, { error: validationResult.error }, false, origin, renewedToken);
    }

    const botId = Number(TextHelper.SanitizeToDirectText(bodyObject.data.id));
    const limitsValidationResult = await ZuzonaSubscriptionsProcessor.CheckSubscription_AddBot({
        masterId: Number(telegramUser.id),
        botId: botId,
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return ReturnRestApiResult(422, { error: 'not valid subscription data' }, false, origin, renewedToken);
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return ReturnRestApiResult(429, { error: 'Subscription plan limits exceeded' }, false, origin, renewedToken);
    }

    const result = await MessagingBotManager.AddMyBot(validationResult.item);

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
