import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, DataValidationParameter } from '/opt/LambdaHelpers/ValidateIncomingData';
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
import { ITelegramSimpleFile } from '/opt/ContentTypes';
import { ETelegramSendMethod, ETelegramSendMethods } from '/opt/TelegramTypes';

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
        { key: 'chatId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'message', datatype: 'object', objectKeys: [] },
        {
            key: 'sendMethod',
            datatype: [...ETelegramSendMethods.map((value) => value.toString())]
        }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const result = await MessageSender.SendPlainMessage({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),

        message: {
            text: TextHelper.KeepOnlyTelegramTags(bodyObject.data.message.text),
            attachments: (bodyObject.data.message.attachments as Array<ITelegramSimpleFile>).map((value) => {
                return {
                    id: TextHelper.SanitizeToDirectText(value.id),
                    name: TextHelper.SanitizeToDirectText(value.name)
                } as ITelegramSimpleFile;
            })
        },
        recipientChatId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.chatId)),
        sendMethod: bodyObject.data.sendMethod
    });

    const sendResult = ParseSendMessageResult(result);

    const returnRestApiResult = ReturnRestApiResult(sendResult.code, sendResult.body, false, origin, renewedToken);
    console.log('returnRestApiResult', returnRestApiResult);
    return returnRestApiResult;
}
