import * as jwt from 'jsonwebtoken';
import { TelegramUserProfile } from './Types';
//@ts-ignore
import BotManager from '/opt/BotManager';

export async function RefreshTokenFromCookie(userProfile: TelegramUserProfile, salt: string) {
    try {
        //const secret: jwt.Secret =
        const clearedProfile = userProfile as any;
        if (Object.hasOwn(clearedProfile, 'exp')) {
            delete clearedProfile['exp'];
        }
        if (Object.hasOwn(clearedProfile, 'exp')) {
            delete clearedProfile['iat'];
        }
        const accessToken = jwt.sign(userProfile, salt, {
            algorithm: 'HS256',
            expiresIn: process.env.accessTokenExpirationMinutes! + ' minutes'
        });

        const data = { accessToken: accessToken, userProfile: clearedProfile };

        return data;
    } catch (error) {
        console.log('Error:RefreshTokenFromCookie\n', error);
        return { accessToken: undefined, userProfile: undefined };
    }
}
