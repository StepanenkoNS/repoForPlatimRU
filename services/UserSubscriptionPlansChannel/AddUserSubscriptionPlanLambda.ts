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
import { ESupportedCurrency } from '/opt/PaymentTypes';

import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';

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
        { key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'prices', datatype: 'array' },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'channelId', datatype: 'number(integer)' }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlanChannel.AddUserSubscriptionPlanChannel({
        masterId: Number(telegramUser.id),
        discriminator: 'IUserSubscriptionPlanChannel',
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        enabled: bodyObject.data.enabled,
        lengthInDays: Number(TextHelper.SanitizeToDirectText(bodyObject.data.lengthInDays)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        prices: bodyObject.data.prices,
        channelId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.channelId))
    });
    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
