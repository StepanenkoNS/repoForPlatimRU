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

//@ts-ignore
import UserSubscriptionPlanBot from '/opt/UserSubscriptionPlanBot';

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
        { key: 'price', datatype: 'number(nonZeroPositive)' },
        { key: 'currency', datatype: e },
        { key: 'enabled', datatype: 'boolean' }
    ]);

    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlanBot.AddUserSubscriptionPlanBot({
        masterId: telegramUser.id,
        discriminator: 'IUserSubscriptionPlanBot',
        botId: bodyObject.botId,
        currency: bodyObject.currency,
        enabled: bodyObject.enabled,
        lengthInDays: bodyObject.lengthInDays,
        name: bodyObject.name,
        price: bodyObject.price
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
