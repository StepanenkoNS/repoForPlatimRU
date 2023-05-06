import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import {
    ParseSendMessageResult,
    ReturnRestApiResult
    //@ts-ignore
} from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { MessageSender } from '/opt/MessageSender';

//@ts-ignore

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);
    console.log(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'contentPlanPostId', datatype: 'string' },
        { key: 'sendMethod', datatype: ['sendMessage', 'sendPhoto', 'sendAudio', 'sendDocument', 'sendDocument', 'sendVideo', 'sendAnimation', 'sendVoice', 'sendVideoNote'] },
        { key: 'message', datatype: 'object', objectKeys: [] },
        { key: 'interaction', datatype: 'object', objectKeys: [] }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const result = await MessageSender.SendTestContentPlanMessage({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        contentPlanId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanId),
        contentPlanPostId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanPostId),
        interaction: bodyObject.data.interaction,
        message: bodyObject.data.message,
        sendMethod: TextHelper.SanitizeToDirectText(bodyObject.data.sendMethod) as any
    });

    const sendResult = ParseSendMessageResult(result);

    const returnRestApiResult = ReturnRestApiResult(sendResult.code, sendResult.body, false, origin, renewedToken);
    console.log('returnRestApiResult', returnRestApiResult);
    return returnRestApiResult;
}
