import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingEventBody';
import { EPaymentTypes } from '../../../TGBot-CoreLayers/LambdaLayers/Types/PaymentTypes';
import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import PaymentMethodsManager from '/opt/PaymentMethodsManager';

export async function AddPaymentOptionsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, ['name', 'type', 'description', 'currency']);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    if (bodyObject.type === 'INTEGRATION') {
        bodyObject = ValidateIncomingEventBody(event, ['token']);
        if (bodyObject === false) {
            return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body - token not provided' }, false, origin, renewedToken);
        }
    }
    try {
        let dbResult: any[] = [];
        if (bodyObject.type === 'DIRECT') {
            await PaymentMethodsManager.AddDirectPaymentMethod(telegramUser.id, {
                name: bodyObject.name,
                type: EPaymentTypes.DIRECT,
                currency: bodyObject.currency,
                description: bodyObject.description
            });
        }
        if (bodyObject.type === 'INTEGRATION') {
            await PaymentMethodsManager.AddIntegrationPaymentMethod(telegramUser.id, {
                name: bodyObject.name,
                type: EPaymentTypes.INTEGRATION,
                token: bodyObject.token,
                currency: bodyObject.currency,
                description: bodyObject.description
            });
        }
        const returnObject = ReturnRestApiResult(200, { success: true }, false, origin, renewedToken);
        console.log(returnObject);
        return returnObject;
    } catch (error) {
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
