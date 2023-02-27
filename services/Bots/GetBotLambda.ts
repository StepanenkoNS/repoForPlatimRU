import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseGetItemResult, ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingArray, ValidateIncomingEventBody, ValidateStringParameters } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import BotManager from '/opt/BotManager';

function isNumber(value: string | number): boolean {
    return value != null && value !== '' && !isNaN(Number(value.toString()));
}

export async function GetBotHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event)) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const BOTUUID = event.queryStringParameters!.id!;

    const result = await BotManager.GetMyBot(telegramUser.id, BOTUUID);
    const getResult = ParseGetItemResult(result);
    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
