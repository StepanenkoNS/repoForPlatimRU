import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseGetItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { MessagingBotManager } from '/opt/MessagingBotManager';
import { ETelegramBotCommand } from '/opt/MessagingBotManagerTypes';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['botId', 'id'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }
    if (
        !Object.values(ETelegramBotCommand)
            .filter((v) => isNaN(Number(v)))
            .includes(event.queryStringParameters!.id! as any)
    ) {
        console.log('Error: mailformed id');
        return ReturnRestApiResult(422, { error: 'Error: mailformed id' }, false, origin, renewedToken);
    }
    const result = await MessagingBotManager.GetMyBotCommand({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)),
        id: TextHelper.SanitizeToDirectText(event.queryStringParameters!.id!) as any
    });
    const getResult = ParseGetItemResult(result);
    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
