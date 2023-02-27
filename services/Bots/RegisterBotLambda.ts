import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseGetItemResult, ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingArray, ValidateIncomingEventBody, ValidateStringParameters } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import BotManager from '/opt/BotManager';

export async function RegisterBotHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);
    console.log(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [{ key: 'id', datatype: 'string' }]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await BotManager.RegisterMyBot(telegramUser.id, bodyObject.id);

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
