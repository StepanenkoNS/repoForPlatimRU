import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { EPaymentType, IPaymentOptionDirectCardTransfer, IPaymentOptionPaymentIntegration } from '/opt/PaymentTypes';

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
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'type', datatype: ['DIRECT', 'INTEGRATION'] },
        { key: 'description', datatype: 'string' },
        { key: 'currency', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    if (bodyObject.data.type === EPaymentType.INTEGRATION) {
        bodyObject = ValidateIncomingEventBody(event, [{ key: 'token', datatype: 'string' }]);
        if (bodyObject.success === false) {
            return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
        }
    }

    let result: boolean | IPaymentOptionDirectCardTransfer | IPaymentOptionPaymentIntegration | undefined = false;
    if (bodyObject.data.type === EPaymentType.INTEGRATION) {
        const integrationRequest: IPaymentOptionPaymentIntegration = {
            id: bodyObject.data.id,
            masterId: Number(telegramUser.id),
            botId: Number(bodyObject.data.botId),
            discriminator: 'IPaymentOptionPaymentIntegration',
            name: bodyObject.data.name,
            type: EPaymentType.INTEGRATION,
            token: bodyObject.data.token,
            currency: bodyObject.data.currency,
            description: bodyObject.data.description
        };
        result = await PaymentOptionsManager.EditPaymentOption(integrationRequest);
    }

    if (bodyObject.data.type === EPaymentType.DIRECT) {
        result = await PaymentOptionsManager.EditPaymentOption({
            id: bodyObject.data.id,
            masterId: Number(telegramUser.id),
            botId: Number(bodyObject.data.botId),
            discriminator: 'IPaymentOptionDirectCardTransfer',
            name: bodyObject.data.name,
            type: EPaymentType.DIRECT,
            currency: bodyObject.data.currency,
            description: bodyObject.data.description
        });
    }
    const udpateResult = ParseUpdateItemResult(result);
    return ReturnRestApiResult(udpateResult.code, udpateResult.body, false, origin, renewedToken);
}
