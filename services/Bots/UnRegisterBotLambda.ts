import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { MessagingBotManager } from '/opt/MessagingBotManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['id'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const botId = event.queryStringParameters!.id!;

    const result = await MessagingBotManager.RemoveWebhook({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(botId))
    });
    const getResult = ParseGetItemResult(result);
    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
