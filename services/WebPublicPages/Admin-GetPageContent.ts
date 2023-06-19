import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguage } from 'tgbot-project-types/TypesCompiled/LocaleTypes';
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { PublicWebPageManager } from '/opt/PublicWebPageManager';

type Page = {
    pagePath: string;
    locale: ESupportedLanguage;
    itemName?: string;
    pageId?: string;
};
const fallbackLocale = defaultMenuLanguage;

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(JSON.stringify(event));

    const origin = SetOrigin(event);

    let locale: string = fallbackLocale;
    let pagePath: string | undefined;

    const queryParams = event.queryStringParameters;
    if (queryParams) {
        locale = !queryParams['locale'] ? fallbackLocale : queryParams['locale'].toLowerCase();
        pagePath = !queryParams['pagePath'] ? undefined : queryParams['pagePath'].toLowerCase();
    } else {
        console.log('query params not provided');
        const returnObject = ReturnBlankApiResult(422, { success: false, error: 'query params  not provided' }, origin);
        return returnObject as APIGatewayProxyResult;
    }
    if (pagePath === undefined) {
        console.log('query params not provided');
        const returnObject = ReturnBlankApiResult(422, { success: false, error: 'query param pagePath not provided' }, origin);
        return returnObject as APIGatewayProxyResult;
    }

    const result = await PublicWebPageManager.GetPublicWebPageContent({
        locale: locale,
        PKPostfix: 'publicPages',
        pagePath: pagePath
    });

    const getResult = ParseItemResult(result);

    return ReturnBlankApiResult(getResult.code, getResult.body, origin);
}
