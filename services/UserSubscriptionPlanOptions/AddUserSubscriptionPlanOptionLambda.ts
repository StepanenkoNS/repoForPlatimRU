import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import UserSubscriptionPlan from '/opt/UserSubscriptionPlan';

export async function AddUserSubscriptionPlanOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'userSubscriptionPlanId', datatype: 'string' },
        { key: 'ids', datatype: 'array' }
    ]);

    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlan.AddUserSubscriptionPlanOption({
        discriminator: 'IUserSubscriptionPlanOption',
        masterId: telegramUser.id,
        BOTUUID: bodyObject.BOTUUID,
        userSubscriptionPlanId: bodyObject.userSubscriptionPlanId,
        ids: bodyObject.ids
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
