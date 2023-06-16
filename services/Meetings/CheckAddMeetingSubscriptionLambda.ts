import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';

import { PomponaSubscriptionsProcessor } from 'opt/PomponaSubscriptionsProcessor';
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
            method: 'ANALYTICS',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'QueryString parameters are invald' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await PomponaSubscriptionsProcessor.CheckSubscription_AddMeeting({
        key: {
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!))
        },
        userJsonData: telegramUser
    });
    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ANALYTICS',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
