import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { IMessagingBot } from '/opt/MessagingBotManagerTypes';
//@ts-ignore
import { MessagingBotManager } from '/opt/MessagingBotManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'description', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const bot: IMessagingBot = {
        masterId: Number(telegramUser.id),
        id: Number(TextHelper.SanitizeToDirectText(bodyObject.data.id)),
        description: TextHelper.SanitizeToDirectText(bodyObject.data.description),
        token: bodyObject.data.token ? TextHelper.SanitizeToDirectText(bodyObject.data.token) : undefined,
        discriminator: 'IMessagingBot'
    };
    console.log('bot', bot);
    const result = await MessagingBotManager.UpdateMyBot(bot);

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
