import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingEventBody';
import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import PaymentMethodsManager from '/opt/PaymentMethodsManager';

export async function ListPaymentOptionsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    // let bodyObject = ValidateIncomingEventBody(event, ['chatId']);
    // if (bodyObject === false) {
    //     return ReturnRestApiResult(422, { error: 'Error: mailformed body' }, false, origin, renewedToken);
    // }

    try {
        const dbResult = await PaymentMethodsManager.GetMyPaymentMethods(telegramUser.id);
        const returnObject = ReturnRestApiResult(200, dbResult, true, origin, renewedToken);
        console.log('returnObject\n', returnObject);
        return returnObject;
    } catch (error) {
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
