import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { EnumToArray } from 'services/Helper/EnumToArray';
import { ESupportedCurrency } from '/opt/PaymentTypes';
import UserSubscriptionPlanBot from '/opt/UserSubscriptionPlanBot';

export async function EditUserSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'contentPlans', datatype: 'array' },
        { key: 'prices', datatype: 'array' },

        { key: 'enabled', datatype: 'boolean' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    try {
        const result = await UserSubscriptionPlanBot.UpdateUserSubscriptionPlanBot({
            id: bodyObject.data.id,
            masterId: telegramUser.id,
            discriminator: 'IUserSubscriptionPlanBot',
            botId: bodyObject.data.botId,
            enabled: bodyObject.data.enabled,
            contentPlans: bodyObject.data.contentPlans,
            lengthInDays: bodyObject.data.lengthInDays,
            name: bodyObject.data.name,
            prices: bodyObject.data.prices
        });

        const updateResult = ParseUpdateItemResult(result);
        return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
    } catch (error) {
        return ReturnRestApiResult(500, { success: false, error: 'Internal server error' }, false, origin, renewedToken);
    }
}
