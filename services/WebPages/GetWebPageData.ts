import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { ddbDocClient } from '/opt/DDB/ddbDocClient';
import { defaultMenuLanguage, ESupportedLanguages } from '/opt/ConfiguratorTypes';
import { Item } from 'aws-sdk/clients/simpledb';

type Page = {
    pagePath: string;
    locale: ESupportedLanguages;
    itemName?: string;
    pageId?: string;
};
const fallbackLocale = defaultMenuLanguage;

export async function GetWebPageDataHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    console.log(JSON.stringify(event));

    let origin = 'https://' + process.env.cookieDomain;
    if (event.headers && event.headers.origin) {
        //todo - удалить перед деплоем
        const array = process.env.allowedOrigins!.split(',');
        if (array.includes(origin)) {
            origin = event.headers.origin;
        }
    }
    if (!event.body) {
        console.log('body not provided');
        const returnObject = ReturnRestApiResult(422, { error: 'body not provided' }, origin);
        return returnObject as APIGatewayProxyResult;
    }
    try {
        const body = JSON.parse(event.body);
        if (!body.pagePath) {
            const returnObject = ReturnRestApiResult(422, { error: 'pagePath not provided' }, origin);
            return returnObject as APIGatewayProxyResult;
        }
        let locale = !body.locale ? fallbackLocale : body.locale;
        try {
            const dbResponce = await ddbDocClient.query({
                TableName: process.env.webTable!,
                KeyConditionExpression: 'PK = :PK AND begins_with (SK, :SK_PREFIX)',
                ExpressionAttributeValues: {
                    ':PK': 'PATH#' + (body.pagePath as string).toLowerCase() + '#LOCALE#' + (locale as string).toLowerCase(),
                    ':SK_PREFIX': 'ITEMID#'
                }
            });
            const array: [string, any][] = [];
            if (dbResponce.Items) {
                for (const item of dbResponce.Items) {
                    const x = { ...item };
                    if (x.hasOwnProperty('PK')) {
                        delete x.PK;
                    }
                    if (x.hasOwnProperty('SK')) {
                        delete x.SK;
                    }
                    array.push([(item.SK as string).replace('ITEMID#', ''), x]);
                    //array.push((item.SK as string).replace('ITEMID#', ''), x);
                }
            } else {
                console.log('no items returned from DDBQuery');
            }

            const returnObject = ReturnRestApiResult(200, array, origin);
            return returnObject as APIGatewayProxyResult;
        } catch (error) {
            console.log('DynamoDB error\n', error);
            const returnObject = ReturnRestApiResult(422, { error: 'Database error' }, origin);
            return returnObject as APIGatewayProxyResult;
        }
    } catch (error) {
        console.log('error: Body is not in JSON');
        const returnObject = ReturnRestApiResult(422, { error: 'Body is not in JSON' }, origin);
        return returnObject as APIGatewayProxyResult;
    }
}
