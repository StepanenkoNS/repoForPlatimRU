import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ReturnRestApiResult, ParseDeleteItemResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';
import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';
import { SetOrigin } from '../Utils/OriginHelper';

export async function DeleteSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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

    const result = await BotSubscriptionConfigurator.DeleteSubscriptionPlan(telegramUser.id, bodyObject.id);

    const deleteResult = ParseDeleteItemResult(result);

    return ReturnRestApiResult(deleteResult.code, deleteResult.body, false, origin, renewedToken);
}
