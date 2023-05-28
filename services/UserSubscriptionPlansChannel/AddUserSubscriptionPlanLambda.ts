import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore

import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';
import { IUserSubscriptionPlanChannel } from '/opt/UserSubscriptionTypes';

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
        { key: 'enabled', datatype: 'boolean' },
        { key: 'channelId', datatype: 'number(integer)' }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }
    if (bodyObject.data.lifeTime == false) {
        const step2 = ValidateIncomingEventBody(event, [{ key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' }]);
        if (step2.success === false) {
            return ReturnRestApiResult(422, { success: false, error: 'lengthInDays should not be empty when lifeTime is false' }, false, origin, renewedToken);
        }
    }

    const potentialItem: IUserSubscriptionPlanChannel = {
        masterId: Number(telegramUser.id),

        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        lifeTime: bodyObject.data.lifeTime,
        enabled: bodyObject.data.enabled,
        lengthInDays: Number(TextHelper.SanitizeToDirectText(bodyObject.data.lengthInDays)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        prices: bodyObject.data.prices,
        channelId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.channelId))
    };

    const schemaValidationResult = await SchemaValidator.UserSubscriptionPlanChannel_Validator(potentialItem);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return ReturnRestApiResult(422, { error: schemaValidationResult.error }, false, origin, renewedToken);
    }
    const result = await UserSubscriptionPlanChannel.AddUserSubscriptionPlanChannel(schemaValidationResult.item as any);
    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
