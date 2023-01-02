import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseUpdateItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';
import { EPaymentType, PaymentOptionDirectCardTransfer, PaymentOptionPaymentIntegration } from '/opt/PaymentTypes';
import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import PaymentOptionsManager from '/opt/PaymentOptionsManager';

export async function EditPaymentOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'type', datatype: ['DIRECT', 'INTEGRATION'] },
        { key: 'description', datatype: 'string' },
        { key: 'currency', datatype: 'string' },
        { key: 'conversionRatio', datatype: 'number(nonZeroPositive)' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    if (bodyObject.type === EPaymentType.INTEGRATION) {
        bodyObject = ValidateIncomingEventBody(event, [{ key: 'token', datatype: 'string' }]);
        if (bodyObject === false) {
            return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body - token not provided' }, false, origin, renewedToken);
        }
    }
    const chatId = telegramUser.id;

    let result: boolean | PaymentOptionDirectCardTransfer | PaymentOptionPaymentIntegration | undefined = false;
    if (bodyObject.type === EPaymentType.INTEGRATION)
        result = await PaymentOptionsManager.EditPaymentOption(chatId, bodyObject.id, {
            name: bodyObject.name,
            type: EPaymentType.INTEGRATION,
            token: bodyObject.token,
            currency: bodyObject.currency,
            conversionRatio: bodyObject.conversionRatio,
            description: bodyObject.description
        });

    if (bodyObject.type === EPaymentType.DIRECT)
        result = await PaymentOptionsManager.EditPaymentOption(chatId, bodyObject.id, {
            name: bodyObject.name,
            type: EPaymentType.DIRECT,
            currency: bodyObject.currency,
            conversionRatio: bodyObject.conversionRatio,
            description: bodyObject.description
        });
    const udpateResult = ParseUpdateItemResult(result);
    return ReturnRestApiResult(udpateResult.code, udpateResult.body, false, origin, renewedToken);
}
