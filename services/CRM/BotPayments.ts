import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { CrmManager } from '/opt/CrmManager';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['botId'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    let type: 'NEW' | 'CONFIRMED' | 'REJECTED' | undefined = undefined;

    if (ValidateStringParameters(event, ['type'])) {
        const tempType = TextHelper.SanitizeToDirectText(event.queryStringParameters!.type!);
        if (tempType == 'NEW' || tempType == 'CONFIRMED' || tempType == 'REJECTED') {
            type = tempType;
        } else {
            return ReturnRestApiResult(422, { error: 'Type parameter is invalid' }, false, origin, renewedToken);
        }
    }

    const result = await CrmManager.ListMyBotPayments({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)),
        type: type
    });

    const listResults = ParseListResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
