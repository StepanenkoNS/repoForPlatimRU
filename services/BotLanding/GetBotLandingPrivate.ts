import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguages } from '/opt/LocaleTypes';
import { GetLandingSubdomainFromOrigin, SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore

import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
import { BotLanging } from '/opt/BotLanding';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log('event', JSON.stringify(event));

    const origin = SetOrigin(event);

    if (origin == '') {
        return ReturnRestApiResult(422, { error: 'origin is incorrect' }, false, event.headers?.origin ? event.headers.origin : '', undefined);
    }

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['id'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const botId = event.queryStringParameters!.id!;

    //const subdomain = TextHelper.SanitizeToDirectText(GetLandingSubdomainFromOrigin(event));

    const subdomain = 'pomponabot';

    const result = await BotLanging.GetBotLangingPrivate(Number(botId));
    const getResult = ParseItemResult(result);

    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, undefined);
}
