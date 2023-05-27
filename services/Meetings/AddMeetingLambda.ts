import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { TextHelper } from '/opt/TextHelpers/textHelper';

//@ts-ignore
import { CalendarMeetingsConfiguratior } from '/opt/CalendarMeetingsConfiguratior';

import { IAddEditCalendarMeeting } from '/opt/CalendarMeetingTypes';
import { ZuzonaSubscriptionsProcessor } from '/opt/ZuzonaSubscriptionsProcessor';
export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event.body);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(positiveInteger)' },

        { key: 'name', datatype: 'string' },
        { key: 'buttonCaption', datatype: 'string' },

        { key: 'allDay', datatype: 'boolean' },
        { key: 'format', datatype: ['OFFLINE', 'ONLINE'] },
        { key: 'participantsLimit', datatype: 'number(positiveInteger)' },
        { key: 'ds', datatype: 'string' },
        { key: 'df', datatype: 'string' },
        { key: 'prices', datatype: 'array' },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'description', datatype: 'string' },
        { key: 'secretAnswer', datatype: 'string' },
        { key: 'sendOfflineTicket', datatype: 'boolean' },
        { key: 'freeEvent', datatype: 'boolean' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const command: IAddEditCalendarMeeting = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        buttonCaption: TextHelper.SanitizeToDirectText(bodyObject.data.buttonCaption),
        allDay: bodyObject.data.allDay,
        format: bodyObject.data.format,
        participantsLimit: Number(TextHelper.SanitizeToDirectText(bodyObject.data.participantsLimit)),
        ds: TextHelper.SanitizeToDirectText(bodyObject.data.ds),
        df: TextHelper.SanitizeToDirectText(bodyObject.data.df),
        prices: bodyObject.data.prices,
        enabled: bodyObject.data.enabled,
        description: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.description),
        secretAnswer: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.secretAnswer),
        sendOfflineTicket: bodyObject.data.sendOfflineTicket,
        freeEvent: bodyObject.data.freeEvent
    };

    const limitsValidationResult = await ZuzonaSubscriptionsProcessor.CheckSubscription_AddMeeting({
        key: {
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!))
        },
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return ReturnRestApiResult(422, { error: 'not valid subscription data' }, false, origin, renewedToken);
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return ReturnRestApiResult(429, { error: 'Subscription plan limits exceeded' }, false, origin, renewedToken);
    }

    const result = await CalendarMeetingsConfiguratior.AddMeeting(command);

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
