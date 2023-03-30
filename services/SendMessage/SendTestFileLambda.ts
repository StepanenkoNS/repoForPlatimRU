import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import {
    ParseDeleteItemResult,
    ParseGetItemResult,
    ParseInsertItemResult,
    ParseListItemsResult,
    ParseSendMessageResult,
    ParseUpdateItemResult,
    ReturnRestApiResult
    //@ts-ignore
} from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import MessageSender from '/opt/MessageSender';
import { ETelegramSendMethod } from '/opt/TelegramTypes';
//@ts-ignore

function getSendMethodEnum(enumValue: string) {
    if (enumValue === 'sendMessage') return ETelegramSendMethod.sendMessage;
    if (enumValue === 'sendPhoto') return ETelegramSendMethod.sendPhoto;
    if (enumValue === 'sendAudio') return ETelegramSendMethod.sendAudio;
    if (enumValue === 'sendDocument') return ETelegramSendMethod.sendDocument;
    if (enumValue === 'sendVideo') return ETelegramSendMethod.sendVideo;
    if (enumValue === 'sendAnimation') return ETelegramSendMethod.sendAnimation;
    if (enumValue === 'sendVoice') return ETelegramSendMethod.sendVoice;
}

export async function SendTestFileHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);
    console.log(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'fileId', datatype: 'string' }
    ]);

    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await MessageSender.SendTestFile(telegramUser.id, Number(bodyObject.botId), bodyObject.fileId);

    const sendResult = ParseSendMessageResult(result);
    console.log('sendResult', sendResult);
    const returnRestApiResult = ReturnRestApiResult(sendResult.code, sendResult.body, false, origin, renewedToken);
    console.log('returnRestApiResult', returnRestApiResult);
    return returnRestApiResult;
}
