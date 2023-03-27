import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseDeleteItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import UserSubscriptionPlan from '/opt/UserSubscriptionPlan';

export async function DeleteUserSubscriptionPlanOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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
        { key: 'contentPlanId', datatype: 'string' }
    ]);
    if (bodyObject === false) {
        console.log('Error: mailformed JSON body');
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await UserSubscriptionPlan.DeleteUserSubscriptionPlanOption({
        masterId: telegramUser.id,
        BOTUUID: bodyObject.BOTUUID,
        contentPlanId: bodyObject.contentPlanId,
        userSubscriptionPlanId: bodyObject.userSubscriptionPlanId
    });

    const deleteResult = ParseDeleteItemResult(result);

    return ReturnRestApiResult(deleteResult.code, deleteResult.body, false, origin, renewedToken);
}
