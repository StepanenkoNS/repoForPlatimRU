import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingEventBody';
import BotManager from '/opt/BotManager';
import { SetOrigin } from '../Utils/OriginHelper';
import { ESupportedCurrency } from '../../../TGBot-CoreLayers/LambdaLayers/Types/PaymentTypes';

export async function EditCurrencySettingsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, ['defaultCurrency']);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }
    const newCurrency = bodyObject.defaultCurrency;
    if (!Object.keys(ESupportedCurrency).includes(newCurrency)) {
        return ReturnRestApiResult(422, { error: 'Error: not supported currency' }, false, origin, renewedToken);
    }

    try {
        await BotManager.ChangeMyDefaultCurrency(telegramUser.id, newCurrency);
        const returnObject = ReturnRestApiResult(201, { defaultCurrency: newCurrency }, false, origin, renewedToken);
        console.log(returnObject);
        return returnObject;
    } catch (error) {
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
