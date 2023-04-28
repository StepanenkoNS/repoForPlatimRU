import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { defaultMenuLanguage, ESupportedLanguages } from '/opt/LocaleTypes';
import { ReturnArticlesMapFromDB, ReturnCategoriesAsArray, ReturnCategoriesMapFromDB } from '/opt/LambdaHelpers/HCHelper';
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';

type Page = {
    pagePath: string;
    locale: ESupportedLanguages;
    itemName?: string;
    pageId?: string;
};
const fallbackLocale = defaultMenuLanguage;

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

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
        const returnObject = ReturnRestApiResult(422, { error: 'category or subcategory not provided' }, false, origin);
        return returnObject as APIGatewayProxyResult;
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

        const returnObject = ReturnRestApiResult(200, ResultObject, true, origin);
        return returnObject as APIGatewayProxyResult;
    } catch (error) {
        console.log('DynamoDB error\n', error);
        const returnObject = ReturnRestApiResult(422, { error: 'Database error' }, false, origin);
        return returnObject as APIGatewayProxyResult;
    }
}
