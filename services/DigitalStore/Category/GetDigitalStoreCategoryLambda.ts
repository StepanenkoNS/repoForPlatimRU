import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { ContentConfigurator } from '/opt/ContentConfigurator';
//@ts-ignore
import { DigitalStoreManager } from '/opt/DigitalStoreManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['id', 'botId'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const result = await DigitalStoreManager.GetMyBotDigitalStoreCategoryById({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)),
        id: TextHelper.SanitizeToDirectText(event.queryStringParameters!.id!)
    });
    const getResult = ParseItemResult(result);

    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
