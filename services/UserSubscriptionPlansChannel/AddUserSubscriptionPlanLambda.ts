import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { ESupportedCurrency } from '/opt/PaymentTypes';

import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';

export async function AddUserSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    const e = [ESupportedCurrency.EUR.toString(), ESupportedCurrency.GBP.toString(), ESupportedCurrency.RUB.toString(), ESupportedCurrency.TRY.toString(), ESupportedCurrency.USD.toString()];
    console.log('EnumToArray', e);
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
        masterId: telegramUser.id,
        discriminator: 'IUserSubscriptionPlanChannel',
        botId: bodyObject.data.botId,
        enabled: bodyObject.data.enabled,
        lengthInDays: bodyObject.data.lengthInDays,
        name: bodyObject.data.name,
        prices: bodyObject.data.prices,
        channelId: bodyObject.data.channelId
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
