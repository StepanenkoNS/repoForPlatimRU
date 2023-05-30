import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguages } from '/opt/LocaleTypes';
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore

import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { BotLanging } from '/opt/BotLanding';
import { IBotLanding } from '/opt/BotLandingTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(JSON.stringify(event));
    const origin = SetOrigin(event);
    console.log('origin', origin);
    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'subdomain', datatype: 'string' },
        { key: 'title', datatype: 'string' },
        { key: 'elements', datatype: 'array' },
        { key: 'body', datatype: 'string' },
        { key: 'footer', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    const botLanding: IBotLanding = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        title: TextHelper.SanitizeToDirectText(bodyObject.data.title),
        elements: bodyObject.data.elements,
        subdomain: TextHelper.SanitizeToDirectText(bodyObject.data.subdomain)
    };

    const result = await BotLanging.UpdateBotLanging(botLanding);

    const updateResult = ParseItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
