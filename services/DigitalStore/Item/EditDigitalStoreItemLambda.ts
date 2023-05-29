import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { IDigitalStoreItem } from '/opt/DigitalStoreTypes';
//@ts-ignore
import { DigitalStoreManager } from '/opt/DigitalStoreManager';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
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
        { key: 'itemNameForUser', datatype: 'string' },
        { key: 'text', datatype: 'string' },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'free', datatype: 'boolean' },
        { key: 'digitalStoreCategoryId', datatype: 'string' },
        { key: 'items', datatype: 'array' },
        { key: 'prices', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    const potentialItem: IDigitalStoreItem = {
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        masterId: Number(telegramUser.id),
        itemNameForUser: TextHelper.SanitizeToDirectText(bodyObject.data.itemNameForUser),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        text: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.text),
        enabled: bodyObject.data.enabled,
        digitalStoreCategoryId: TextHelper.SanitizeToDirectText(bodyObject.data.digitalStoreCategoryId),
        items: bodyObject.data.items,
        free: bodyObject.data.free,
        prices: bodyObject.data.prices
    };

    const schemaValidationResult = await SchemaValidator.DigitalStoreItem_Validator(potentialItem);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return ReturnRestApiResult(422, { error: schemaValidationResult.error }, false, origin, renewedToken);
    }

    const result = await DigitalStoreManager.UpdateDigitalStoreItem(schemaValidationResult.item as any);

    const updateResult = ParseItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
