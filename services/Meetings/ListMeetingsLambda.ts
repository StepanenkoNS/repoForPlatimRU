import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';

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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'LIST',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'QueryString parameters are invald' },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const dsAsDate = new Date(TextHelper.SanitizeToDirectText(event.queryStringParameters!.ds!));
    const dfAsDate = new Date(TextHelper.SanitizeToDirectText(event.queryStringParameters!.df!));

    const diff = Math.abs(dsAsDate.getTime() - dfAsDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    if (diffDays > 101) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'LIST',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'too long range selected' },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await CalendarMeetingsConfiguratior.ListMyMeetings({
        key: { masterId: Number(telegramUser.id), botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!)) },
        range: {
            ds: TextHelper.SanitizeToDirectText(event.queryStringParameters!.ds!),
            df: TextHelper.SanitizeToDirectText(event.queryStringParameters!.df!)
        }
    });

    const dataResult = ParseListResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'LIST',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
