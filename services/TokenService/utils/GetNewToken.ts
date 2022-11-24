import * as jwt from 'jsonwebtoken';
import { TelegramUserProfile } from './Types';
import { ValidateTelegramHash } from './ValidateTGUser';
//@ts-ignore
import BotManager from '/opt/BotManager';
import { ReturnResult } from './ReturnResult';
import { TelegramUser } from 'services/Utils/Types';

export async function CreateNewTokens(user: TelegramUser, origin: string) {
    try {
        if (!ValidateTelegramHash(user)) {
            const result = {
                error: 'Error: hash is invalid'
            };
            return ReturnResult(422, result, origin);
        }

        //get or create
        const botManager = await BotManager.GetOrCreate({
            chatId: user.id,
            userName: user.username
        });

        const userProfile: TelegramUserProfile = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            photo_url: user.photo_url,
            username: user.username,
            language: botManager.GetBotManagerMenuLanguage(),
            role: 'admin'
        };
        const accessToken = jwt.sign(userProfile, process.env.hashSalt!, {
            algorithm: 'HS256',
            expiresIn: process.env.accessTokenExpirationMinutes! + ' minutes'
        });

        const refreshToken = jwt.sign(userProfile, process.env.hashSalt!, {
            algorithm: 'HS256',
            expiresIn: process.env.refreshTokenExpirationDays! + ' days'
        });

        const result = {
            userProfile: userProfile
        };
        return ReturnResult(201, result, origin, {
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        const result = {
            error: JSON.stringify(error)
        };
        return ReturnResult(503, result, origin);
    }
}
