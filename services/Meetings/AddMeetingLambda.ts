import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { TextHelper } from '/opt/TextHelpers/textHelper';
//@ts-ignore
import { MeetingsConfiguratior } from '/opt/MeetingsConfiguratior';
import { IMeeting } from '/opt/MeetingTypes';
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
        { key: 'meetingType', datatype: 'object', objectKeys: [] },
        { key: 'location', datatype: 'string' },
        { key: 'participantsLimit', datatype: 'number(nonZeroPositiveInteger)', nullable: true },
        { key: 'appliedParticipants', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'date', datatype: 'string' },
        { key: 'lengthMinutes', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'enabled', datatype: 'boolean' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const command: IMeeting = {
        discriminator: 'IMeeting',
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        meetingType: TextHelper.SanitizeToDirectText(bodyObject.data.meetingType) as any,
        location: TextHelper.SanitizeToDirectText(bodyObject.data.location),
        participantsLimit: bodyObject.data.participantsLimit,
        appliedParticipants: Number(TextHelper.SanitizeToDirectText(bodyObject.data.appliedParticipants)),
        date: TextHelper.SanitizeToDirectText(bodyObject.data.date),
        lengthMinutes: Number(TextHelper.SanitizeToDirectText(bodyObject.data.lengthMinutes)),
        enabled: bodyObject.data.enabled
    };
    const result = await MeetingsConfiguratior.AddMeeting(command);

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
