import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingArray, ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';

//@ts-ignore
import { IMasterBot } from '/opt/ConfiguratorTypes';
import BotManager from '/opt/BotManager';

export async function EditBotHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'description', datatype: 'string' },
        { key: 'token', datatype: 'string' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const bot: IMasterBot = {
        masterId: telegramUser.id,
        id: bodyObject.id,
        name: bodyObject.name,
        description: bodyObject.description,
        token: bodyObject.token ? bodyObject.token : '',
        registered: false,
        registeredBotId: undefined
    };
    console.log('bot', bot);
    const result = await BotManager.UpdateMyBot(bot);

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
