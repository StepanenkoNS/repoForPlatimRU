import * as jwt from 'jsonwebtoken';
import { TelegramUserProfile } from './Types';
export function RefreshTokenFromCookie(refreshToken: string) {
    try {
        const decoded = jwt.verify(refreshToken, process.env.hashSalt!, {
            algorithms: ['HS256']
        });

        let userProfile: TelegramUserProfile = {
            id: (decoded as TelegramUserProfile).id,
            language: (decoded as TelegramUserProfile).language,
            role: 'admin'
        };

        if ((decoded as TelegramUserProfile).first_name) {
            userProfile = { ...{ first_name: (decoded as TelegramUserProfile).first_name }, ...userProfile };
        }
        if ((decoded as TelegramUserProfile).last_name) {
            userProfile = { ...{ last_name: (decoded as TelegramUserProfile).last_name }, ...userProfile };
        }
        if ((decoded as TelegramUserProfile).photo_url) {
            userProfile = { ...{ photo_url: (decoded as TelegramUserProfile).photo_url }, ...userProfile };
        }
        if ((decoded as TelegramUserProfile).username) {
            userProfile = { ...{ username: (decoded as TelegramUserProfile).username }, ...userProfile };
        }
        console.log('userProfile', userProfile);

        //const secret: jwt.Secret =
        const accessToken = jwt.sign(userProfile, process.env.hashSalt!, {
            algorithm: 'HS256',
            expiresIn: process.env.accessTokenExpirationMinutes! + ' minutes'
        });

        const data = { accessToken: accessToken, userProfile: userProfile };
        console.log(data);
        return data;
    } catch (error) {
        console.log('RefreshTokenFromCookieError\n', error);
        return { accessToken: undefined, userProfile: undefined };
    }
}
