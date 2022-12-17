import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ReturnRestApiResult, ParseInsertItemResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';
import { EPaymentType, PaymentOptionDirectCardTransfer, PaymentOptionPaymentIntegration } from '/opt/PaymentTypes';
import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import PaymentOptionsManager from '/opt/PaymentOptionsManager';

export async function AddPaymentOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'name', datatype: 'string' },
        { key: 'type', datatype: ['DIRECT', 'INTEGRATION'] },
        { key: 'description', datatype: 'string' },
        { key: 'currency', datatype: 'string' },
        { key: 'conversionRatio', datatype: 'number(nonZeroPositive)' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    if (bodyObject.type === 'INTEGRATION') {
        bodyObject = ValidateIncomingEventBody(event, [{ key: 'token', datatype: 'string' }]);
        if (bodyObject === false) {
            return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body - token not provided' }, false, origin, renewedToken);
        }
    }

    let result: boolean | PaymentOptionDirectCardTransfer | PaymentOptionPaymentIntegration = false;
    if (bodyObject.type === 'DIRECT') {
        result = await PaymentOptionsManager.AddDirectPaymentOption(telegramUser.id, {
            name: bodyObject.name,
            type: EPaymentType.DIRECT,
            currency: bodyObject.currency,
            conversionRatio: bodyObject.conversionRatio,
            description: bodyObject.description
        });
    }
    if (bodyObject.type === 'INTEGRATION') {
        result = await PaymentOptionsManager.AddIntegrationPaymentOption(telegramUser.id, {
            name: bodyObject.name,
            type: EPaymentType.INTEGRATION,
            token: bodyObject.token,
            currency: bodyObject.currency,
            conversionRatio: bodyObject.conversionRatio,
            description: bodyObject.description
        });
    }
    const addResult = ParseInsertItemResult(result);
    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
