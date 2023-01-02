import { APIGatewayProxyResult } from 'aws-lambda';
//@ts-ignore
import { Tokens } from '/opt/AuthTypes';

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
            const dateIncrement = new Date().getTime() + Number(process.env.accessTokenExpirationMinutes!) * 60 * 1000;
            accessTokenExpirationDate.setTime(dateIncrement);
            accessTokenCookie =
                'accessToken=' + tokens.accessToken + '; Expires=' + accessTokenExpirationDate.toUTCString() + '; Secure; HttpOnly; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';
            cookiesArray.push(accessTokenCookie);
        }

        if (tokens.refreshToken) {
            const refreshTokenExpirationDate = new Date();
            const dateIncrement = new Date().getTime() + Number(process.env.refreshTokenExpirationDays!) * 24 * 60 * 60 * 1000;
            refreshTokenExpirationDate.setTime(dateIncrement);
            refreshTokenCookie =
                'refreshToken=' +
                tokens.refreshToken +
                '; Expires=' +
                refreshTokenExpirationDate.toUTCString() +
                '; Secure; HttpOnly; SameSite=None; Domain=.' +
                process.env.cookieDomain! +
                '; Path=/';
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

    // if (cookiesArray.length > 0) {
    //     returnObject = {
    //         ...{
    //             multiValueHeaders: {
    //                 'Set-Cookie': [...cookiesArray]
    //             }
    //         },
    //         ...returnObject
    //     };
    // }

    return returnObject;
}

export function LogOut(origin: string) {
    const accessTokenCookie = 'accessToken= ; Secure; HttpOnly; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';
    const refreshTokenCookie = 'refreshToken= ; Secure; HttpOnly; SameSite=None; Domain=.' + process.env.cookieDomain! + '; Path=/';

    const cookiesArray: string[] = [accessTokenCookie, refreshTokenCookie];

    let returnObject: APIGatewayProxyResult = {
        statusCode: 201,
        body: JSON.stringify({ logOut: true }),
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

    return returnObject;
}
