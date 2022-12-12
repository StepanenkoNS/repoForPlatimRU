import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';
import { EPaymentTypes } from '../../../TGBot-CoreLayers/LambdaLayers/Types/PaymentTypes';
import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import PaymentOptionsManager from '/opt/PaymentOptionsManager';

export async function DeletePaymentOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [{ key: 'id', datatype: 'string' }]);
    if (bodyObject === false) {
        console.log('Error: mailformed JSON body');
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    try {
        await PaymentOptionsManager.DeletePaymentMethod(telegramUser.id, bodyObject.id);
        const returnObject = ReturnRestApiResult(200, { success: true }, false, origin, renewedToken);

        return returnObject;
    } catch (error) {
        console.log(error);
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
