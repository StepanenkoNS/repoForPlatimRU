import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';

import { UserSubscriptionPlanBot } from 'opt/UserSubscriptionPlanBot';
//@ts-ignore
import { SchemaValidator } from 'opt/YUP/SchemaValidator';
import { IUserSubscriptionPlanBot } from 'opt/UserSubscriptionTypes';

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
        { key: 'lifeTime', datatype: 'boolean' },
        { key: 'lengthInDays', datatype: 'number(positiveInteger)' },
        { key: 'prices', datatype: 'array' },
        { key: 'contentPlans', datatype: 'array' },

        { key: 'enabled', datatype: 'boolean' }
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

    if (bodyObject.data.lifeTime == false) {
        const step2 = ValidateIncomingEventBody(event, [{ key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' }]);
        if (step2.success === false) {
            return await ReturnRestApiResult({
                statusCode: 422,
                method: 'ADD',
                masterId: Number(telegramUser.id),
                data: { success: false, error: 'lengthInDays should not be empty when lifeTime is false' },
                withMapReplacer: false,
                origin: origin,
                renewedAccessToken: renewedToken
            });
        }
    }

    const potentialItem: IUserSubscriptionPlanBot = {
        masterId: telegramUser.id,

        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        contentPlans: bodyObject.data.contentPlans,
        lifeTime: bodyObject.data.lifeTime,
        enabled: bodyObject.data.enabled,
        lengthInDays: Number(TextHelper.SanitizeToDirectText(bodyObject.data.lengthInDays)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        prices: bodyObject.data.prices
    };

    const schemaValidationResult = await SchemaValidator.UserSubscriptionPlanBot_Validator(potentialItem);
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

    const result = await UserSubscriptionPlanBot.AddUserSubscriptionPlanBot(schemaValidationResult.item as any);
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
