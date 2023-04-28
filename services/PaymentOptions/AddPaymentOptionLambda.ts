import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { EPaymentType, IPaymentOptionDirectCardTransfer, IPaymentOptionPaymentIntegration } from '/opt/PaymentTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 'type', datatype: ['DIRECT', 'INTEGRATION'] },
        { key: 'description', datatype: 'string' },
        { key: 'currency', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    if (bodyObject.data.type === 'INTEGRATION') {
        bodyObject = ValidateIncomingEventBody(event, [{ key: 'token', datatype: 'string' }]);
        if (bodyObject.success === false) {
            return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
        }
    }

    let result: boolean | IPaymentOptionDirectCardTransfer | IPaymentOptionPaymentIntegration = false;
    if (bodyObject.data.type === 'DIRECT') {
        result = await PaymentOptionsManager.AddDirectPaymentOption({
            masterId: Number(telegramUser.id),
            botId: Number(bodyObject.data.botId),
            discriminator: 'IPaymentOptionDirectCardTransfer',
            name: bodyObject.data.name,
            type: EPaymentType.DIRECT,
            currency: bodyObject.data.currency,
            description: bodyObject.data.description
        });
    }
    if (bodyObject.data.type === 'INTEGRATION') {
        result = await PaymentOptionsManager.AddIntegrationPaymentOption({
            masterId: Number(telegramUser.id),
            botId: Number(bodyObject.data.botId),
            discriminator: 'IPaymentOptionPaymentIntegration',
            name: bodyObject.data.name,
            type: EPaymentType.INTEGRATION,
            token: bodyObject.data.token,
            currency: bodyObject.data.currency,
            description: bodyObject.data.description
        });
    }
    const addResult = ParseInsertItemResult(result);
    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
