import { RefreshTokenFromCookie } from './RefreshToken';
import * as jwt from 'jsonwebtoken';

import { APIGatewayEvent } from 'aws-lambda';
//@ts-ignore
import BotManager from '/opt/BotManager';
//@ts-ignore
import { TelegramUserProfile, ZuzonaRole } from '/opt/AuthTypes';

function getTokenFromCookes(cookies: string) {
    let accessToken = cookies.split('; ').reduce((r, v) => {
        const parts: string[] = v.split('=');
        return parts[0] === 'accessToken' ? decodeURIComponent(parts[1]) : r;
    }, '');

    let refreshToken = cookies.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === 'refreshToken' ? decodeURIComponent(parts[1]) : r;
    }, '');

    while (refreshToken.length > 0 && (refreshToken.charAt(refreshToken.length - 1) == ';' || refreshToken.charAt(refreshToken.length - 1) == ' ')) {
        refreshToken = refreshToken.slice(0, -1);
    }
    while (accessToken.length > 0 && (accessToken.charAt(accessToken.length - 1) == ';' || accessToken.charAt(accessToken.length - 1) == ' ')) {
        accessToken = accessToken.slice(0, -1);
    }
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}
type DenyResult = {
    effect: 'Deny';
    message: string;
};

type AllowResult = {
    principalId: string;
    effect: 'Allow';
    context: any;
    userProfile: TelegramUserProfile;
};
export async function ValidateTokenFromCookies(event: APIGatewayEvent): Promise<DenyResult | AllowResult> {
    if (!(event.headers.cookie || event.headers.Cookie)) {
        console.log('Cookies not provided');
        return { effect: 'Deny', message: 'Cookies not provided' };
    }
    let cookie = '';
    if (event.headers.Cookie) {
        cookie = event.headers.Cookie;
    }
    if (event.headers.cookie) {
        cookie = event.headers.cookie;
    }
    const tokensFromCookies = getTokenFromCookes(cookie);
    let userProfile: TelegramUserProfile;

    let salt: string | undefined = undefined;
    if (tokensFromCookies.refreshToken == undefined || tokensFromCookies.refreshToken == '') {
        console.log('refreshToken not defined');
        return { effect: 'Deny', message: 'refreshToken not defined' };
    } else {
        try {
            userProfile = jwt.decode(tokensFromCookies.refreshToken) as TelegramUserProfile;
            if (!userProfile.id || userProfile.id == undefined || isNaN(userProfile.id)) {
                const err = {
                    error: JSON.stringify({ error: 'user id is invalid' })
                };
                console.log('Error:ValidateTokenFromCookies\n', err);
                throw err;
            }
            if (!userProfile.username) {
                userProfile.username = undefined;
            }

            let botManager: BotManager;
            try {
                botManager = await BotManager.GetOrCreate({
                    masterId: userProfile.id,
                    userName: userProfile.username
                });
            } catch (error) {
                const err = {
                    error: JSON.stringify({ error: 'BotManager.GetOrCreate error' })
                };
                console.log('Error:ValidateTokenFromCookies\n', error);
                throw err;
            }

            console.log('isBannedCheck ' + userProfile.id.toString(), botManager.isBanned());
            if (botManager.isBanned()) {
                const err = {
                    error: JSON.stringify({ error: 'user is banned' })
                };
                console.log('Error:ValidateTokenFromCookies', err);
                throw err;
            }
            salt = botManager.getSalt();
            if (!salt) {
                const err = {
                    error: JSON.stringify({ error: 'salt is undefined' })
                };
                console.log('Error:ValidateTokenFromCookies', err);
                throw err;
            }
            try {
                console.log('data', tokensFromCookies.refreshToken, salt);
                jwt.verify(tokensFromCookies.refreshToken, salt, {
                    algorithms: ['HS256']
                });
            } catch (error) {
                console.log('Error:ValidateTokenFromCookies:jwt.verify for refreshToken\n', error);
                throw 'Refresh token verification failed';
            }
        } catch (error) {
            return { effect: 'Deny', message: JSON.stringify(error) };
        }
    }
    let renewAccessToken = false;
    let accessIdentity: {
        accessToken?: string;
        userProfile?: TelegramUserProfile;
    } = {
        accessToken: tokensFromCookies.accessToken
    };
    if (accessIdentity.accessToken == undefined || accessIdentity.accessToken == '') {
        //выпускаем новый accessToken
        try {
            accessIdentity = await RefreshTokenFromCookie(userProfile, salt!);
            renewAccessToken = true;
        } catch (error) {
            console.log('Error:ValidateTokenFromCookies:RefreshTokenFromCookie\n', error);
            return { effect: 'Deny', message: 'accessToken generation error' };
        }
    } else {
        try {
            const accessUserProfile = jwt.decode(accessIdentity.accessToken) as TelegramUserProfile;
            if (!accessUserProfile.id) {
                throw 'user id is not defined';
            }
            if (!accessUserProfile.username) {
                accessUserProfile.username = undefined;
            }

            const decoded = jwt.verify(accessIdentity.accessToken, salt!, {
                algorithms: ['HS256']
            });
            accessIdentity.userProfile = decoded as TelegramUserProfile;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                try {
                    accessIdentity = await RefreshTokenFromCookie(userProfile, salt!);
                    renewAccessToken = true;
                } catch (error) {
                    const err = {
                        error: JSON.stringify({ error: 'accessToken is empty after generation' })
                    };
                    console.log('Error:ValidateTokenFromCookies:RefreshTokenFromCookie', err);
                    return { effect: 'Deny', message: 'accessToken generation error 2' };
                }
            } else {
                const err = {
                    error: JSON.stringify({ error: 'accessToken verification error' })
                };
                console.log('Error:ValidateTokenFromCookies:RefreshTokenFromCookie', err);
                return { effect: 'Deny', message: 'accessToken verification error error' };
            }
        }
    }
    if (!accessIdentity.accessToken || !accessIdentity.userProfile) {
        const err = {
            error: JSON.stringify({ error: 'accessToken is empty after generation' })
        };
        console.log('Error:ValidateTokenFromCookies', err);
        throw err;
    }
    try {
        let responseContext = {
            ...accessIdentity.userProfile

            //      refreshToken: tokensFromCookies.refreshToken,
        };
        if (renewAccessToken) {
            responseContext = {
                ...{ renewedAccessToken: accessIdentity.accessToken },
                ...responseContext
            };
        }
        const result: AllowResult = {
            principalId: accessIdentity.userProfile.id.toString(),
            effect: 'Allow',
            context: responseContext,
            userProfile: accessIdentity.userProfile
        };
        if (process.env.AllowUsers != '') {
            const usersArray = process.env.AllowUsers?.split(',');
            console.log('AllowUsers - array', usersArray);
            if (!usersArray?.includes(userProfile.id.toString())) {
                return { effect: 'Deny', message: 'Guarded mode: only superadmins allowed' };
            }
        } else {
            return result;
        }

        return result;
    } catch (error) {
        console.log('Error:ValidateTokenFromCookies:Finalization\n', error);
        return { effect: 'Deny', message: 'Token validation error' };
    }
}
