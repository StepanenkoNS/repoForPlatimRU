import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { MessagingBotManager } from '/opt/MessagingBotManager';
import { ETelegramBotCommand } from '/opt/MessagingBotManagerTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'botId', datatype: 'number(positiveInteger)' }
    ]);
    if (bodyObject.success === false) {
        console.log('Error: mailformed JSON body');
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
    const result = await MessagingBotManager.DeleteMyBotCommand({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id) as any
    });
    const deleteResult = ParseItemResult(result);
    return ReturnRestApiResult(deleteResult.code, deleteResult.body, false, origin, renewedToken);
}
