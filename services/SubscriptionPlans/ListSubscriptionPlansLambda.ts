import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ParseListItemsResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';

import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';

export async function ListSubscriptionPlansHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    const result = await BotSubscriptionConfigurator.ListMySubscriptionPlans(telegramUser.id);
    const listResult = ParseListItemsResult(result);

    return ReturnRestApiResult(listResult.code, listResult.body, true, origin, renewedToken);
}
