import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseDeleteItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';
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
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await PaymentOptionsManager.DeletePaymentOption(telegramUser.id, bodyObject.id);
    const deleteResult = ParseDeleteItemResult(result);
    return ReturnRestApiResult(deleteResult.code, deleteResult.body, false, origin, renewedToken);
}
