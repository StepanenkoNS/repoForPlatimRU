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
import { ETelegramBotCommand, IMessagingBotCommand } from '/opt/MessagingBotManagerTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { TextHelper } from '/opt/TextHelpers/textHelper';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'text', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }
    if (
        !Object.values(ETelegramBotCommand)
            .filter((v) => isNaN(Number(v)))
            .includes(bodyObject.data.id)
    ) {
        console.log('Error: mailformed id');
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const command: IMessagingBotCommand = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id) as any,
        text: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.text)
    };
    const result = await MessagingBotManager.AddMyBotCommand(command);

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
