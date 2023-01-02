//@ts-ignore
import { defaultLocale } from '/opt/LocaleTypes';
import { ddbDocClient } from '/opt/DDB/ddbDocClient';

//@ts-ignore
export async function GetItemFromDB(locale: string, PKPostfix: string = 'publicPages', pagePath: string) {
    const fallbackLocale = defaultLocale;
    const key = { PK: 'LOCALE#' + locale + '#PATH#' + PKPostfix, SK: 'PAGE#' + pagePath };
    try {
        const dbResponce = await ddbDocClient.get({
            Key: key,
            TableName: process.env.webTable!
        });

        if (!dbResponce.Item) {
            if (locale === fallbackLocale) {
                const message = 'Item not found in DB for fallbackLocale\n' + JSON.stringify(key);
                return false;
            } else {
                const message = 'Item not found in DB for provided locale\n' + JSON.stringify(key);
                console.log('Trying to get FallBackLocaleItem');
                return GetItemFromDB(fallbackLocale, PKPostfix, pagePath);
            }
        }
        let item = { ...dbResponce.Item };
        if (item.hasOwnProperty('PK')) {
            delete item.PK;
        }
        if (item.hasOwnProperty('SK')) {
            delete item.SK;
        }
        return item;
    } catch (error) {
        console.log('Error:GetItemFromDB\n', error);
        const message = 'Error:GetItemFromDB\n' + JSON.stringify(key);
        throw message;
    }
}
