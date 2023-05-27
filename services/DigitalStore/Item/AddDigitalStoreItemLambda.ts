import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { DigitalStoreManager } from '/opt/DigitalStoreManager';

import { IDigitalStoreCategory, IDigitalStoreItem } from '/opt/ContentTypes';
import { ZuzonaSubscriptionsProcessor } from '/opt/ZuzonaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 'buttonCaption', datatype: 'string' },
        { key: 'text', datatype: 'string' },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'digitalStoreCategoryId', datatype: 'string' },
        { key: 'items', datatype: 'array' },
        { key: 'free', datatype: 'boolean' },
        { key: 'prices', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const item: IDigitalStoreItem = {
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        masterId: Number(telegramUser.id),
        buttonCaption: TextHelper.SanitizeToDirectText(bodyObject.data.buttonCaption),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        text: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.text),
        enabled: bodyObject.data.enabled,
        digitalStoreCategoryId: TextHelper.SanitizeToDirectText(bodyObject.data.digitalStoreCategoryId),
        items: bodyObject.data.items,
        free: bodyObject.data.free,
        prices: bodyObject.data.prices
    };

    const limitsValidationResult = await ZuzonaSubscriptionsProcessor.CheckSubscription_AddDigitalStoreCategoryItem({
        key: {
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)),
            digitalStoreCategoryId: item.digitalStoreCategoryId
        },
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return ReturnRestApiResult(422, { error: 'not valid subscription data' }, false, origin, renewedToken);
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return ReturnRestApiResult(429, { error: 'Subscription plan limits exceeded' }, false, origin, renewedToken);
    }

    const result = await DigitalStoreManager.AddDigitalStoreItem(item);

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
