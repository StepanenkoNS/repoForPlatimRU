import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';

import { BotCommands } from '/opt/BotCommands';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    if (!ValidateStringParameters(event, ['botId'])) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'LIST',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'QueryString parameters are invald' },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await BotCommands.ListMyBotCommands({ masterId: Number(telegramUser.id), botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)) });

    const dataResult = ParseListResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'LIST',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
