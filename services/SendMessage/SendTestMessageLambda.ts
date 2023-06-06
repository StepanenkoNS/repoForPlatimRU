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
import { ETelegramSendMethods } from '/opt/TelegramTypes';
import { EPostTriggerType, ITelegramNaivMessageContent, PostTrigger } from '/opt/ContentTypes';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';

//@ts-ignore

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
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'contentPlanPostId', datatype: 'string' },
        { key: 'interaction', datatype: 'object', objectKeys: [] },
        { key: 'message', datatype: 'object', objectKeys: [] },
        { key: 'trigger', datatype: 'object', objectKeys: [] }
    ]);

    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const trigger = bodyObject.data.trigger as PostTrigger;
    const message: ITelegramNaivMessageContent = bodyObject.data.message;

    const msgContent = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        contentPlanId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanId),
        contentPlanPostId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanPostId),
        interaction: bodyObject.data.interaction,
        message: message,
        trigger: trigger
    };

    const result = await MessageSender.SendTestContentPlanMessage(msgContent);

    const sendResult = ParseSendMessageResult(result);

    const returnRestApiResult = ReturnRestApiResult(sendResult.code, sendResult.body, false, origin, renewedToken);
    console.log('returnRestApiResult', returnRestApiResult);
    return returnRestApiResult;
}
