import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguages } from '/opt/LocaleTypes';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { GetItemFromDB } from 'services/Utils/WebPagesHelper';

type Page = {
    pagePath: string;
    locale: ESupportedLanguages;
    itemName?: string;
    pageId?: string;
};
const fallbackLocale = defaultMenuLanguage;

export async function GetWebPageContentHandler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(JSON.stringify(event));

    const origin = SetOrigin(event);

    let locale: string;
    let pagePath: string | undefined;

    const queryParams = event.queryStringParameters;
    if (queryParams) {
        locale = !queryParams['locale'] ? fallbackLocale : queryParams['locale'].toLowerCase();
        pagePath = !queryParams['pagePath'] ? undefined : queryParams['pagePath'].toLowerCase();
    } else {
        console.log('query params not provided');
        const returnObject = ReturnRestApiResult(422, { success: false, error: 'query params  not provided' }, false, origin);
        return returnObject as APIGatewayProxyResult;
    }
    if (pagePath === undefined) {
        console.log('query params not provided');
        const returnObject = ReturnRestApiResult(422, { success: false, error: 'query param pagePath not provided' }, false, origin);
        return returnObject as APIGatewayProxyResult;
    }
    try {
        const result = await GetItemFromDB(locale, 'publicPages', pagePath);

        if (result === false) {
            const message = 'Item not found in DB\nLocale:' + locale + '\nPrefix: publicPages' + '\nSK:' + pagePath;
            return ReturnRestApiResult(404, { success: false, error: message }, false, origin);
        }

        return ReturnRestApiResult(200, { success: true, item: result }, false, origin);
    } catch (error) {
        console.log('DynamoDB error\n', error);
        const returnObject = ReturnRestApiResult(500, { success: false, error: 'Database error' }, false, origin);
        return returnObject as APIGatewayProxyResult;
    }
}
