import { APIGatewayProxyResult } from 'aws-lambda';
import { Tokens } from './Types';

export function ReturnResult(statusCode: number, data: any, origin: string, tokens?: Tokens) {
    if (!(statusCode in [200, 201])) {
        if (data.hasOwnProperty('error')) {
            console.log('Error: ', JSON.stringify(data.error));
        }
    }

    let accessTokenCookie = '';
    let refreshTokenCookie = '';
    const cookiesArray: string[] = [];
    if (tokens && tokens !== undefined) {
        if (tokens.accessToken) {
            const accessTokenExpirationDate = new Date();
            accessTokenExpirationDate.setTime(new Date().getTime() + 1000 * Number(process.env.accessTokenExpirationMinutes!) * 60);
            accessTokenCookie =
                'accessToken=' + tokens.accessToken + '; Expires=' + accessTokenExpirationDate.toUTCString() + '; Secure; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';
            cookiesArray.push(accessTokenCookie);
        }

        if (tokens.refreshToken) {
            const refreshTokenExpirationDate = new Date();
            refreshTokenExpirationDate.setTime(new Date().getTime() + 1000 * Number(process.env.refreshTokenExpirationDays!) * 60) * 24 * 60 * 60;
            refreshTokenCookie =
                'refreshToken=' + tokens.refreshToken + '; Expires=' + refreshTokenExpirationDate.toUTCString() + '; Secure; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';
            cookiesArray.push(refreshTokenCookie);
        }
    }

    let returnObject: APIGatewayProxyResult = {
        statusCode: statusCode,
        body: JSON.stringify(data),
        multiValueHeaders: {
            'Set-Cookie': [...cookiesArray]
        },
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin, // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    };

    if (cookiesArray.length > 0) {
        returnObject = {
            ...{
                multiValueHeaders: {
                    'Set-Cookie': [...cookiesArray]
                }
            },
            ...returnObject
        };
    }
    console.log('returnObject\n', returnObject);
    return returnObject;
}
