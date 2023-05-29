import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { CalendarMeetingsConfiguratior } from '/opt/CalendarMeetingsConfiguratior';
export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    if (!ValidateStringParameters(event, ['botId', 'ds', 'df'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const dsAsDate = new Date(TextHelper.SanitizeToDirectText(event.queryStringParameters!.ds!));
    const dfAsDate = new Date(TextHelper.SanitizeToDirectText(event.queryStringParameters!.df!));

    const diff = Math.abs(dsAsDate.getTime() - dfAsDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays > 101) {
        return ReturnRestApiResult(422, { error: 'too long range selected' }, false, origin, renewedToken);
    }

    const result = await CalendarMeetingsConfiguratior.ListMyMeetings({
        key: { masterId: Number(telegramUser.id), botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)) },
        range: {
            ds: TextHelper.SanitizeToDirectText(event.queryStringParameters!.ds!),
            df: TextHelper.SanitizeToDirectText(event.queryStringParameters!.df!)
        }
    });

    const listResults = ParseListResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
