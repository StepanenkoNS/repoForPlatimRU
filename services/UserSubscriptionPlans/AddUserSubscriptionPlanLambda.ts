import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingArray, ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseDeleteItemResult, ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';
import { ESubscriptionDurationName } from '/opt/SubscriptionTypes';
import { ESupportedCurrency } from '/opt/PaymentTypes';
import { EnumToArray } from 'services/Helper/EnumToArray';
//@ts-ignore
import UserSubscriptionPlan from '/opt/UserSubscriptionPlan';

export async function AddUserSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    const e = EnumToArray(ESupportedCurrency);
    console.log('EnumToArray', e);
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'masterId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'price', datatype: 'number(nonZeroPositive)' },
        { key: 'currency', datatype: e },
        { key: 'enabled', datatype: 'boolean' }
    ]);

    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlan.AddUserSubscriptionPlan({
        masterId: telegramUser.id,
        discriminator: 'IUserSubscriptionPlan',
        BOTUUID: bodyObject.BOTUUID,
        currency: bodyObject.currency,
        enabled: bodyObject.enabled,
        lengthInDays: bodyObject.lengthInDays,
        name: bodyObject.name,
        price: bodyObject.price
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
