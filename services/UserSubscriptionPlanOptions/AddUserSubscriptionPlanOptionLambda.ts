import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import UserSubscriptionPlanBot from '/opt/UserSubscriptionPlanBot';
import { IAddUserSubscriptionPlanOption } from '/opt/UserSubscriptionTypes';

export async function AddUserSubscriptionPlanOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'userSubscriptionPlanId', datatype: 'string' },
        { key: 'ids', datatype: 'array' }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }
    const userSubscriptionPlanOption: IAddUserSubscriptionPlanOption = {
        discriminator: 'IUserSubscriptionPlanOption',
        masterId: telegramUser.id,
        botId: Number(bodyObject.data.botId),
        userSubscriptionPlanId: bodyObject.data.userSubscriptionPlanId,
        ids: bodyObject.data.ids
    };
    const result = await UserSubscriptionPlanBot.AddUserSubscriptionPlanBotOption(userSubscriptionPlanOption);
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
