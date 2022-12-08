import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import BotManager from '/opt/BotManager';

import { SetOrigin } from '../Utils/OriginHelper';

export async function GetCurrencySettingsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);
    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    try {
        const botManager = await BotManager.GetOrCreate({
            chatId: telegramUser.id,
            userName: telegramUser.username
        });

        const currency = botManager.GetMyDefaultCurrency();

        const returnObject = ReturnRestApiResult(200, { defaultCurrency: currency }, false, origin, renewedToken);
        return returnObject;
    } catch (error) {
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
