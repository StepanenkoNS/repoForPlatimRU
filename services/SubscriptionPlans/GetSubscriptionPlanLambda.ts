import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ParseGetItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody, ValidateStringParameters } from 'services/Utils/ValidateIncomingData';

import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';

export async function GetSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event)) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const result = await BotSubscriptionConfigurator.GetMySubscriptionPlanById(telegramUser.id, event.queryStringParameters!.id!);

    const getResult = ParseGetItemResult(result);

    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
