import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';

import { FileTelegramConfigurator } from 'opt/FileTelegramConfigurator';
import { MessagingBotManager } from 'opt/MessagingBotManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (TextHelper.SanitizeToDirectText(bodyObject.data.notes).length > 200) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'notes exceeds 200 chars' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
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

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'EDIT',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
