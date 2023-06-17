import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore

import { MessagingBotManager } from '/opt/MessagingBotManager';
import { FeedBack } from '/opt/FeedBack';
import { IBotGeneralKeyWithUser } from 'tgbot-project-types/TypesCompiled/GeneralTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['botId', 'chatId'])) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ANALYTICS',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'QueryString parameters are invald' },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const key: IBotGeneralKeyWithUser = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)),
        chatId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.chatId!))
    };
    const period = {
        ds: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        df: new Date(new Date().getTime() + 1000).toISOString()
    };
    const result = await FeedBack.GetUserChatData(key, period);

    const dataResult = ParseListResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ANALYTICS',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
