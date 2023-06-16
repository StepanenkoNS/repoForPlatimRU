import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { TextHelper } from 'opt/TextHelpers/textHelper';

//@ts-ignore
import { CalendarMeetingsConfiguratior } from 'opt/CalendarMeetingsConfiguratior';

import { IAddEditCalendarMeeting } from 'opt/CalendarMeetingTypes';
import { PomponaSubscriptionsProcessor } from 'opt/PomponaSubscriptionsProcessor';
//@ts-ignore
import { SchemaValidator } from 'opt/YUP/SchemaValidator';
export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const potentialMeeting: IAddEditCalendarMeeting = {
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

    const schemaValidationResult = await SchemaValidator.Meeting_Validator(potentialMeeting);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: schemaValidationResult.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const limitsValidationResult = await PomponaSubscriptionsProcessor.CheckSubscription_AddMeeting({
        key: {
            masterId: Number(telegramUser.id),
            botId: potentialMeeting.botId
        },
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'not valid subscription data' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return await ReturnRestApiResult({
            statusCode: 429,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'Subscription plan limits exceeded' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await CalendarMeetingsConfiguratior.AddMeeting(schemaValidationResult.item as any);

    const addResult = ParseItemResult(result);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ADD',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
