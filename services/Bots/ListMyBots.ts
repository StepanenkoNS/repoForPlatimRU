import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
//@ts-ignore
import BotManager from '/opt/BotManager';

export async function ListMyBotsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;

    const botManager = await BotManager.GetOrCreate({
        chatId: telegramUser.id,
        userName: telegramUser.username
    });

    botManager.GetMyBots();
    const returnObject = ReturnRestApiResult(200, { templateData: 'template' }, true, origin);

    console.log('returnObject\n', returnObject);
    return returnObject as APIGatewayProxyResult;
}
