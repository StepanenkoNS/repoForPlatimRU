import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

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

    const result = await PaymentOptionsManager.ListMyPaymentOptions({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!))
    });
    const listResult = ParseListResult(result);
    return ReturnRestApiResult(listResult.code, listResult.body, true, origin, renewedToken);
}
