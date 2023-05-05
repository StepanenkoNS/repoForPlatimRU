import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';

//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';

//@ts-ignore
import { ParseDeleteItemResult, ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['botId', 'type'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    let type = event.queryStringParameters!.type!;
    if (!['NEW', 'CONFIRMED', 'REJECTED'].includes(type)) {
        return ReturnRestApiResult(422, { error: 'QueryString parameter type is invald' }, false, origin, renewedToken);
    }

    const result = await PaymentOptionsManager.ListMyBotPayments({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)),
        type: TextHelper.SanitizeToDirectText(type) as any
    });
    const listResult = ParseListItemsResult(result);

    return ReturnRestApiResult(listResult.code, listResult.body, true, origin, renewedToken);
}
