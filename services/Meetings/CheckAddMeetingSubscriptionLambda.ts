import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { CalendarMeetingsConfiguratior } from '/opt/CalendarMeetingsConfiguratior';
import { IZuzonaSubscriptionShort } from '/opt/MasterManagerTypes';
import { MasterManager } from '/opt/MasterManager';
export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['botId'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const currentSubscription = JSON.parse(telegramUser.zuzonaSubscription) as IZuzonaSubscriptionShort;
    const limits = MasterManager.GetZuzonaSubscriptionLimits(currentSubscription);

    const result = await CalendarMeetingsConfiguratior.CheckSubscription_AddMeeting({
        key: {
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!))
        },
        limit: limits.ContentItems.Meetings.count
    });
    const getResult = ParseItemResult(result);
    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
