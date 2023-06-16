import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnBlankApiResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguage } from 'opt/LocaleTypes';
import { GetLandingSubdomainFromOrigin, SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { GetItemFromDB } from 'opt/LambdaHelpers/WebPagesHelper';
import { ValidateStringParameters } from 'opt/LambdaHelpers/ValidateIncomingData';
import { BotLanging } from 'opt/BotLanding';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log('event', JSON.stringify(event));

    let origin = SetOrigin(event);

    if (origin == '') {
        return ReturnBlankApiResult(422, { error: 'origin is incorrect' }, '');
    }

    let subdomain = TextHelper.SanitizeToDirectText(GetLandingSubdomainFromOrigin(event));

    if (subdomain == '' || subdomain.indexOf('localhost') > -1) {
        subdomain = 'pomponabot';
    }

    const result = await BotLanging.GetBotLangingPublic(subdomain);
    const getResult = ParseItemResult(result);

    return ReturnBlankApiResult(getResult.code, getResult.body, origin);
}
