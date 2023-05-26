import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { EPaymentOptionType, IPaymentOptionDirectCardTransfer, IPaymentOptionPaymentIntegration } from '/opt/PaymentTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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

    if (bodyObject.data.type === EPaymentOptionType.INTEGRATION) {
        bodyObject = ValidateIncomingEventBody(event, [{ key: 'token', datatype: 'string' }]);
        if (bodyObject.success === false) {
            return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
        }
    }

    if (bodyObject.data.type === EPaymentOptionType.INTEGRATION) {
        const integrationRequest: IPaymentOptionPaymentIntegration = {
            id: bodyObject.data.id,
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
            discriminator: 'IPaymentOptionPaymentIntegration',
            name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
            type: EPaymentOptionType.INTEGRATION,
            token: TextHelper.SanitizeToDirectText(bodyObject.data.token),
            currency: TextHelper.SanitizeToDirectText(bodyObject.data.currency) as any,
            description: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.description)
        };
        const result = await PaymentOptionsManager.EditPaymentOption(integrationRequest);
        const udpateResult = ParseItemResult(result);
        return ReturnRestApiResult(udpateResult.code, udpateResult.body, false, origin, renewedToken);
    }

    if (bodyObject.data.type === EPaymentOptionType.DIRECT) {
        const result = await PaymentOptionsManager.EditPaymentOption({
            id: bodyObject.data.id,
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
            discriminator: 'IPaymentOptionDirectCardTransfer',
            name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
            type: EPaymentOptionType.DIRECT,
            currency: TextHelper.SanitizeToDirectText(bodyObject.data.currency) as any,
            description: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.description)
        });
        const udpateResult = ParseItemResult(result);
        return ReturnRestApiResult(udpateResult.code, udpateResult.body, false, origin, renewedToken);
    }
    const mockResult = ParseItemResult(undefined);
    return ReturnRestApiResult(mockResult.code, mockResult.body, false, origin, renewedToken);
}
