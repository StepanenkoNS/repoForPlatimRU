import { APIGatewayProxyResult } from 'aws-lambda';
//https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
function replacer(key: any, value: any) {
    if (value instanceof Map) {
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

export default function ReturnRestApiResult(statusCode: number, data: any, origin: string, renewedAccessToken?: string) {
    let accessTokenCookie = '';
    if (renewedAccessToken) {
        const accessTokenExpirationDate = new Date();
        accessTokenExpirationDate.setTime(new Date().getTime() + 1000 * Number(process.env.accessTokenExpirationMinutes!) * 60);

        accessTokenCookie = 'accessToken=' + renewedAccessToken + '; Expires=' + accessTokenExpirationDate.toUTCString() + '; Secure; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';
    }

    let returnObject = {
        statusCode: statusCode,
        body: JSON.stringify(data, replacer),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin, // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    };

    if (renewedAccessToken) {
        returnObject = {
            ...{
                multiValueHeaders: {
                    'Set-Cookie': [accessTokenCookie]
                }
            },
            ...returnObject
        };
    }

    return returnObject as APIGatewayProxyResult;
}
