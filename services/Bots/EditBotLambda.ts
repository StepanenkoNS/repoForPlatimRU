import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

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
import { SchemaValidator } from '/opt/YUP/SchemaValidator';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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
        id: Number(TextHelper.SanitizeToDirectText(bodyObject.data.id)),
        token: TextHelper.SanitizeToDirectText(bodyObject.data.token)
    };

    const validationResult = await SchemaValidator.Bot_Validation(potentialBot);
    if (validationResult.success == false || !validationResult.item) {
        return ReturnRestApiResult(422, { error: validationResult.error }, false, origin, renewedToken);
    }

    const result = await MessagingBotManager.UpdateMyBot(validationResult.item);

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
