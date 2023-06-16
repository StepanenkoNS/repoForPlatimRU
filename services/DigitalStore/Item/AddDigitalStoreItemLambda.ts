import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { DigitalStoreManager } from 'opt/DigitalStoreManager';

import { PomponaSubscriptionsProcessor } from 'opt/PomponaSubscriptionsProcessor';
//@ts-ignore
import { SchemaValidator } from 'opt/YUP/SchemaValidator';
import { IDigitalStoreItem } from 'opt/DigitalStoreTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 'itemNameForUser', datatype: 'string' },
        { key: 'text', datatype: 'string' },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'digitalStoreCategoryId', datatype: 'string' },
        { key: 'items', datatype: 'array' },
        { key: 'free', datatype: 'boolean' },
        { key: 'prices', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const potentialItem: IDigitalStoreItem = {
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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: schemaValidationResult.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const limitsValidationResult = await PomponaSubscriptionsProcessor.CheckSubscription_AddDigitalStoreCategoryItem({
        key: {
            masterId: Number(telegramUser.id),
            botId: potentialItem.botId,
            digitalStoreCategoryId: potentialItem.digitalStoreCategoryId
        },
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'not valid subscription data' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return await ReturnRestApiResult({
            statusCode: 429,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'Subscription plan limits exceeded' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await DigitalStoreManager.AddDigitalStoreItem(schemaValidationResult.item as any);

    const addResult = ParseItemResult(result);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ADD',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
