import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseDeleteItemResult, ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import BotManager from '/opt/BotManager';

import { ESupportedCurrency } from '/opt/PaymentTypes';

export async function EditCurrencySettingsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [{ key: 'defaultCurrency', datatype: 'string' }]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }
    const newCurrency = bodyObject.defaultCurrency;
    if (!Object.keys(ESupportedCurrency).includes(newCurrency)) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: not supported currency' }, false, origin, renewedToken);
    }

    try {
        await BotManager.ChangeMyDefaultCurrency(telegramUser.id, newCurrency);

        const udpateResult = ParseUpdateItemResult({
            defaultCurrency: newCurrency
        });
        return ReturnRestApiResult(udpateResult.code, udpateResult.body, false, origin, renewedToken);
    } catch (error) {
        return ReturnRestApiResult(500, { success: false, error: 'Internal server error' }, false, origin, renewedToken);
    }
}
