import { RefreshTokenFromCookie } from './RefreshToken';
import * as jwt from 'jsonwebtoken';
import { TelegramUserProfile } from './Types';
import { AWSPolicyGenerator } from './AWSPolicyGenerator';

function getTokenFromCookes(cookies: string) {
    let accessToken = cookies.split('; ').reduce((r, v) => {
        const parts = v.split('=');
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
export async function ValidateTokenFromCookies(event: any): Promise<DenyResult | AllowResult> {
    if (!event.headers || !event.headers.cookie) {
        console.log('Cookies not provided');
        //throw new Error("Unauthorized");
        return { effect: 'Deny', message: 'Cookies not provided' };
    }
    const tokensFromCookies = getTokenFromCookes(event.headers.cookie);
    console.log('tokensFromCookies\n', tokensFromCookies);

    if (tokensFromCookies.refreshToken == undefined || tokensFromCookies.refreshToken == '') {
        //throw new Error("Unauthorized");
        console.log('refreshToken not defined');
        return { effect: 'Deny', message: 'refreshToken not defined' };
    } else {
        try {
            const decoded = jwt.verify(tokensFromCookies.refreshToken, process.env.hashSalt!, {
                algorithms: ['HS256']
            });
        } catch (error) {
            console.log('refresh token is invalid\n', tokensFromCookies.refreshToken);
            return { effect: 'Deny', message: 'refresh token is invalid' };
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
            console.log('access token not provided (possibly expired on client side)');
            accessIdentity = RefreshTokenFromCookie(tokensFromCookies.refreshToken);
            renewAccessToken = true;
            console.log('new access token has been issued 2\n', accessIdentity);
        } catch (error) {
            console.log('accessToken generation error 1\n', error);
            return { effect: 'Deny', message: 'accessToken generation error 1' };
        }
    } else {
        try {
            const decoded = jwt.verify(accessIdentity.accessToken, process.env.hashSalt!, {
                algorithms: ['HS256']
            });
            accessIdentity.userProfile = decoded as TelegramUserProfile;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                try {
                    console.log('access token has expired');
                    accessIdentity = RefreshTokenFromCookie(tokensFromCookies.refreshToken);
                    renewAccessToken = true;
                    console.log('new access token has been issued 2\n', accessIdentity);
                } catch (error) {
                    console.log('accessToken generation error 2\n', error);
                    return { effect: 'Deny', message: 'accessToken generation error 2' };
                }
            } else {
                console.log('accessToken verification error error\n', error);
                return { effect: 'Deny', message: 'accessToken verification error error' };
            }
        }
    }
    if (!accessIdentity.accessToken || !accessIdentity.userProfile) {
        console.log('accessToken is empty after generation');
        return { effect: 'Deny', message: 'accessToken is empty after generation' };
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
        return result;
    } catch (error) {
        console.log('ValidateTokenFromCookies Error\n', error);
        return { effect: 'Deny', message: 'Token validation error' };
    }
}
