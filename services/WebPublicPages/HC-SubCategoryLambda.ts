import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ReturnBlankApiResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { defaultMenuLanguage, ESupportedLanguage } from 'tgbot-project-types/TypesCompiled/LocaleTypes';
import { ReturnArticlesMapFromDB, ReturnCategoriesAsArray, ReturnCategoriesMapFromDB } from '/opt/LambdaHelpers/HCHelper';
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';

type Page = {
    pagePath: string;
    locale: ESupportedLanguage;
    itemName?: string;
    pageId?: string;
};
const fallbackLocale = defaultMenuLanguage;

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    let locale: string | undefined;
    let category: string | undefined;
    let subcategory: string | undefined;
    const queryParams = event.queryStringParameters;
    if (queryParams) {
        locale = !queryParams['locale'] ? fallbackLocale : queryParams['locale'];
        category = !queryParams['category'] ? undefined : queryParams['category'];
        subcategory = !queryParams['subcategory'] ? undefined : queryParams['subcategory'];
    } else {
        locale = undefined;
        category = undefined;
        subcategory = undefined;
    }

    if (!category || !locale) {
        console.log('category  not provided');

        return ReturnBlankApiResult(422, { success: false, error: 'category or subcategory not provided' }, origin);
    }
    try {
        const mapArticles = await ReturnArticlesMapFromDB(locale);
        const mapCategories = await ReturnCategoriesMapFromDB(locale, mapArticles);

        const categoriesArray = ReturnCategoriesAsArray(mapCategories, mapArticles);

        const filteredData = categoriesArray.filter((item) => item.slug === category);

        const ResultObject = {
            data: filteredData[0],
            categories: categoriesArray,
            activeTab: subcategory || filteredData[0].subCategories[0].slug
        };

        return ReturnBlankApiResult(200, { success: true, data: ResultObject }, origin);
    } catch (error) {
        console.log('DynamoDB error\n', error);
        return ReturnBlankApiResult(422, { success: false, error: 'DB error' }, origin);
    }
}
