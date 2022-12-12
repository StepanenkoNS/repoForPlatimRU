import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';

import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';

export async function ListSubscriptionOptionsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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
        const plans = await BotSubscriptionConfigurator.ListMySubscriptionPlans(telegramUser.id);
        const returnObject = ReturnRestApiResult(200, plans, true, origin, renewedToken);
        return returnObject;
    } catch (error) {
        console.log('Error:ListSubscriptionOptionsHandler\n', error);
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
