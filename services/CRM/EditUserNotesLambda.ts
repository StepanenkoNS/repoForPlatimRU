import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { FileTelegramConfigurator } from '/opt/FileTelegramConfigurator';
import { MessagingBotManager } from '/opt/MessagingBotManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'id', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'notes', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    if (TextHelper.SanitizeToDirectText(bodyObject.data.notes).length > 200) {
        return ReturnRestApiResult(422, { success: false, error: 'notes exceeds 200 chars' }, false, origin, renewedToken);
    }
    const key = {
        masterId: telegramUser.id,
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        chatId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.id))
    };
    //если указан s3Key - то будем менять старый файл
    const result = await MessagingBotManager.UpdateUserNotes(key, {
        notes: TextHelper.SanitizeToDirectText(bodyObject.data.notes)
    });

    const updateResult = ParseItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
