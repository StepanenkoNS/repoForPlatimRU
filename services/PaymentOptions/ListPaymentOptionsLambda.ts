import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';
import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import PaymentOptionsManager from '/opt/PaymentOptionsManager';

export async function ListPaymentOptionsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    try {
        const dbResult = await PaymentOptionsManager.GetMyPaymentOptions(telegramUser.id);
        const returnObject = ReturnRestApiResult(200, dbResult, true, origin, renewedToken);
        console.log('returnObject\n', returnObject);
        return returnObject;
    } catch (error) {
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
