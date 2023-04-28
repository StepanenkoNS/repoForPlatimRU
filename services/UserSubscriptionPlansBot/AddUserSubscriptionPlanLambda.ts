import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { UserSubscriptionPlanBot } from '/opt/UserSubscriptionPlanBot';

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
        { key: 'name', datatype: 'string' },
        { key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'prices', datatype: 'array' },
        { key: 'contentPlans', datatype: 'array' },

        { key: 'enabled', datatype: 'boolean' }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlanBot.AddUserSubscriptionPlanBot({
        masterId: telegramUser.id,
        discriminator: 'IUserSubscriptionPlanBot',
        botId: bodyObject.data.botId,
        contentPlans: bodyObject.data.contentPlans,
        enabled: bodyObject.data.enabled,
        lengthInDays: bodyObject.data.lengthInDays,
        name: bodyObject.data.name,
        prices: bodyObject.data.prices
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
