import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseListItemsResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

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

    const result = await PaymentOptionsManager.ListMyPaymentOptions(telegramUser.id);
    const listResult = ParseListItemsResult(result);
    return ReturnRestApiResult(listResult.code, listResult.body, true, origin, renewedToken);
}
