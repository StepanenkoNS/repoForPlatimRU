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
import { ETelegramSendMethods } from '/opt/TelegramTypes';

//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';
import { FeedBack } from '/opt/FeedBack';
import { EAdminMessageType, IAddAdminMessage } from '/opt/FeedBackTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'chatId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'message', datatype: 'object', objectKeys: [] }
        // { key: 'userFeedBackId', datatype: 'string' },
        // { key: 'replyToTelegramMessageId', datatype: 'number(positiveInteger)' }
    ]);

    if (bodyObject.success === false) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const data: IAddAdminMessage = {
        masterId: Number(telegramUser.id),

        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        chatId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.chatId)),
        message: bodyObject.data.message,
        replyToTelegramMessageId: bodyObject.data.replyToTelegramMessageId,
        userFeedBackId: bodyObject.data.userFeedBackId
    };

    const answeredMessageType = bodyObject.data.answeredMessageType;

    const result = await FeedBack.ReplyToUserFeedBackFromWeb(data, answeredMessageType);

    const dataResult = ParseSendMessageResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'EDIT',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
