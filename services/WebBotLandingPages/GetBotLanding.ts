import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseGetItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguages } from '/opt/LocaleTypes';
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { GetItemFromDB } from '/opt/LambdaHelpers/WebPagesHelper';
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
import { BotLanging } from '/opt/BotLanding';

type Page = {
    pagePath: string;
    locale: ESupportedLanguages;
    itemName?: string;
    pageId?: string;
};

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log('event', JSON.stringify(event));

    const origin = SetOrigin(event);

    if (!ValidateStringParameters(event, ['id'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, undefined);
    }

    const result = await BotLanging.GetBotLanging(event.queryStringParameters!.id!);
    const getResult = ParseGetItemResult(result);

    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, undefined);
}
