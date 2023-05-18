import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { ContentConfigurator } from '/opt/ContentConfigurator';
import { EContentPlanType, IContentPlan, IDigitalStoreCategory, IDigitalStoreItem } from '/opt/ContentTypes';
//@ts-ignore
import { DigitalStoreManager } from '/opt/DigitalStoreManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'id', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'description', datatype: 'string' },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'digitalStoreCategoryId', datatype: 'string' },
        { key: 'items', datatype: 'array' },
        { key: 'prices', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    const item: IDigitalStoreItem = {
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        masterId: Number(telegramUser.id),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        description: TextHelper.SanitizeToDirectText(bodyObject.data.description),
        enabled: bodyObject.data.enabled,
        digitalStoreCategoryId: TextHelper.SanitizeToDirectText(bodyObject.data.digitalStoreCategoryId),
        items: bodyObject.data.items,
        prices: bodyObject.data.prices
    };

    const result = await DigitalStoreManager.UpdateDigitalStoreItem(item);

    const updateResult = ParseItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
