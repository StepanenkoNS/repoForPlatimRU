//@ts-ignore
import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { BotCommands } from '/opt/BotCommands';
import { IMessagingBotCommand } from '/opt/BotCommandsTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'UPDATE',
            masterId: Number(telegramUser.id),
            data: { error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const command: IMessagingBotCommand = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id) as any,
        text: TextHelper.RemoveUnsupportedHTMLTags(bodyObject.data.text)
    };

    const result = await BotCommands.UpdateMyBotCommand(command);

    const dataResult = ParseItemResult(result);
    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'UPDATE',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
