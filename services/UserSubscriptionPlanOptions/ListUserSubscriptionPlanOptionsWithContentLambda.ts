import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingArray, ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseDeleteItemResult, ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import UserSubscriptionPlan from '/opt/UserSubscriptionPlan';

export async function ListUserSubscriptionPlanOptionsWithContentHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['userSubscriptionPlanId', 'BOTUUID'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlan.ListUserSubscriptionPlanOptionsWithContentPlans({
        BOTUUID: event.queryStringParameters!.BOTUUID!,
        masterId: telegramUser.id,
        userSubscriptionPlanId: event.queryStringParameters!.userSubscriptionPlanId!
    });
    const listResult = ParseListItemsResult(result);

    return ReturnRestApiResult(listResult.code, listResult.body, true, origin, renewedToken);
}
