import { APIGatewayProxyResult } from 'aws-lambda';
// //https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key: any, value: any) {
    if (value instanceof Map) {
        return Array.from(value.entries()); //Object.fromEntries(value);

        return {
            dataType: 'Map',
            value: Array.from(value.entries()) // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function reviver(key: any, value: any) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

export function ReturnRestApiResult(statusCode: number, data: any, withMapReplacer: boolean, origin: string, renewedAccessToken?: string) {
    if (![200, 201, 202, 203, 204].includes(statusCode)) {
        console.log('Error:ReturnRestApiResult\n', data);
    }
    let accessTokenCookie = '';
    if (renewedAccessToken && renewedAccessToken !== '') {
        const accessTokenExpirationDate = new Date();
        accessTokenExpirationDate.setTime(new Date().getTime() + 1000 * Number(process.env.accessTokenExpirationMinutes!) * 60);

        accessTokenCookie = 'accessToken=' + renewedAccessToken + '; Expires=' + accessTokenExpirationDate.toUTCString() + '; Secure; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';
    }
    let body = '';
    if (data instanceof Map || withMapReplacer === true) {
        body = JSON.stringify(data, replacer);
    } else {
        body = JSON.stringify(data);
    }

    let returnObject;

    if (renewedAccessToken && renewedAccessToken !== '') {
        //пришел перевыпущенный токен
        console.log('ReturnRestAPIResult\nAccess token has been reissued');
        returnObject = {
            statusCode: statusCode,
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': origin, // Required for CORS support to work
                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
                'Access-Control-Allow-Headers': '*'
            },
            multiValueHeaders: {
                'Set-Cookie': [accessTokenCookie]
            }
        };
    } else {
        returnObject = {
            statusCode: statusCode,
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
                'Access-Control-Allow-Headers': '*'
            }
        };
    }

    return returnObject as APIGatewayProxyResult;
}

export function ParseDeleteItemResult<T>(deleteResult: boolean | undefined | T) {
    if (deleteResult === undefined) {
        return {
            code: 500,
            body: { success: false, error: 'Internal server error' }
        };
    }

    if (deleteResult === false) {
        return {
            code: 404,
            body: { success: false, error: 'Internal server error' }
        };
    }

    return {
        code: 202,
        body: { success: false, deletedItem: deleteResult as T }
    };
}

export function ParseInsertItemResult<T>(insertResult: boolean | undefined | T) {
    if (insertResult === undefined || insertResult === false) {
        return {
            code: 500,
            body: { success: false, error: 'Internal server error' }
        };
    }

    return {
        code: 201,
        body: { success: true, insertedItem: insertResult as T }
    };
}

export function ParseUpdateItemResult<T>(editResult: boolean | undefined | T) {
    if (editResult === undefined) {
        return {
            code: 500,
            body: { success: false, error: 'Internal server error' }
        };
    }
    if (editResult === false) {
        return {
            code: 404,
            body: { success: false, error: 'Item not found in DB' }
        };
    }
    return {
        code: 201,
        body: { success: true, updatedItem: editResult as T }
    };
}

export function ParseGetItemResult<T>(getResult: boolean | undefined | T) {
    if (getResult === undefined) {
        return {
            code: 500,
            body: { success: false, error: 'Internal server error' }
        };
    }
    if (getResult === false) {
        return {
            code: 404,
            body: { success: false, error: 'Item not found in DB' }
        };
    }
    return {
        code: 201,
        body: { success: true, item: getResult as T }
    };
}

export function ParseListItemsResult<T>(listResult: boolean | undefined | T[]) {
    if (listResult === undefined) {
        return {
            code: 500,
            body: { success: false, error: 'Internal server error' }
        };
    }
    if (listResult === false) {
        return {
            code: 404,
            body: { success: false, error: 'Item not found in DB' }
        };
    }
    return {
        code: 201,
        body: { success: true, items: listResult as T[] }
    };
}
