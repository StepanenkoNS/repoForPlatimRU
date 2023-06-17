import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';

//@ts-ignore

import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    const result = await PomponaSubscriptionsProcessor.ListMySubsriptions(Number(telegramUser.id));
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
