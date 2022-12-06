import { ddbDocClient } from '/opt/DDB/ddbDocClient';

export function ReturnArticlesAsArray(mapArticles: Map<string, any>) {
    const articlesArray: any[] = [];
    for (const article of mapArticles) {
        const a = { ...article[1] };
        a.slug = article[0];
        articlesArray.push(a);
    }
    return articlesArray;
}

export function ReturnCategoriesAsArray(mapCategories: Map<string, any>, mapArticles: Map<string, any>) {
    const categoriesArray: any[] = [];
    for (const category of mapCategories) {
        const subCategoryArray: any[] = [];
        if (category[1].subCategories && (category[1].subCategories.length || category[1].subCategories.size)) {
            for (const subCategory of category[1].subCategories) {
                const articles: any[] = [];
                if (subCategory[1].articles && (subCategory[1].articles.length || subCategory[1].articles.size)) {
                    for (const article of subCategory[1].articles) {
                        const a = { ...{ slug: article[0] }, ...article[1] };
                        articles.push(a);
                    }
                }
                const subCategoryElement = { ...{ slug: subCategory[0] }, ...subCategory[1] };

                subCategoryElement.articles = articles;
                subCategoryArray.push(subCategoryElement);
            }
        }
        const categoryElement = { ...{ slug: category[0] }, ...category[1] };

        categoryElement.subCategories = subCategoryArray;
        categoriesArray.push(categoryElement);
    }
    return categoriesArray;
}

export async function ReturnArticlesMapFromDB(locale: string) {
    const mapArticles = new Map<string, any>();
    const dbResponceArticles = await ddbDocClient.query({
        TableName: process.env.webTable!,
        KeyConditionExpression: 'PK = :PK',
        ExpressionAttributeValues: {
            ':PK': 'LOCALE#' + locale.toLowerCase() + '#PATH#HC#ARTICLES'
        }
    });

    if (dbResponceArticles.Items) {
        for (const item of dbResponceArticles.Items) {
            if (item.visible === true) {
                const x = { ...item };
                if (x.hasOwnProperty('SK')) {
                    delete x.SK;
                }
                if (x.hasOwnProperty('PK')) {
                    delete x.PK;
                }
                mapArticles.set((item.SK as string).replace('ARTICLE#', ''), x);
            }
        }
    } else {
        console.log('no article items returned from DDBQuery');
    }

    return mapArticles;
}

export async function ReturnCategoriesMapFromDB(locale: string, mapArticles: Map<string, any>) {
    const mapCategories = new Map<string, any>();

    const dbResponceCategories = await ddbDocClient.query({
        TableName: process.env.webTable!,
        KeyConditionExpression: 'PK = :PK',
        ExpressionAttributeValues: {
            ':PK': 'LOCALE#' + (locale as string).toLowerCase() + '#PATH#HC#CATEGORIES'
        }
    });

    //заполняем категориями
    if (dbResponceCategories.Items) {
        for (const item of dbResponceCategories.Items) {
            if (!(item.SK as string).includes('#SUBCATEGORY#')) {
                if (item.visible === true) {
                    const x = { ...item };
                    if (x.hasOwnProperty('SK')) {
                        delete x.SK;
                    }
                    if (x.hasOwnProperty('PK')) {
                        delete x.PK;
                    }
                    mapCategories.set((item.SK as string).replace('CATEGORY#', ''), x);
                }
            }
        }
    } else {
        console.log('no category items returned from DDBQuery');
    }
    //заполняем подкатегории
    if (dbResponceCategories.Items) {
        for (const item of dbResponceCategories.Items) {
            if ((item.SK as string).includes('#SUBCATEGORY#')) {
                if (item.visible === true) {
                    const category = (item.SK as string).replace('CATEGORY#', '');
                    const indexOfSubcategory = category.indexOf('#SUBCATEGORY#');
                    const categoryId = category.substring(0, indexOfSubcategory);
                    let subcategoryId = category.substring(indexOfSubcategory + 13, category.length);

                    const categoryElement = mapCategories.get(categoryId);
                    if (!categoryElement.subCategories) {
                        categoryElement.subCategories = new Map<string, any>();
                    }
                    const x = { ...item };
                    if (x.hasOwnProperty('SK')) {
                        delete x.SK;
                    }
                    if (x.hasOwnProperty('PK')) {
                        delete x.PK;
                    }
                    if (x.hasOwnProperty('articles')) {
                        delete x.articles;
                    }
                    x.articles = new Map<string, any>();
                    if (item.articles) {
                        for (const article of item.articles) {
                            const articleId = article.replace('ARTICLE#', '');
                            if (mapArticles.has(articleId)) {
                                x.articles.set(articleId, mapArticles.get(articleId));
                            }
                        }
                    }
                    categoryElement.subCategories.set(subcategoryId, x);

                    mapCategories.set(categoryId, categoryElement);
                }
            }
        }
    } else {
        console.log('no category items returned from DDBQuery');
    }
    return mapCategories;
}
