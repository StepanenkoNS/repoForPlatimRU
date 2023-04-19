import * as jwt from 'jsonwebtoken';

import { ValidateTelegramHash } from './ValidateTGUser';
//@ts-ignore
import MasterManager from '/opt/MasterManager';
import { ReturnResult } from './ReturnResult';
//@ts-ignore
import { TelegramUser, TelegramUserProfile, ZuzonaRole } from '/opt/AuthTypes';

export async function CreateNewTokens(user: TelegramUser, origin: string) {
    try {
        if (!ValidateTelegramHash(user)) {
            const result = {
                error: 'Error: hash is invalid'
            };
            return ReturnResult(422, result, origin);
        }

        //get or create
        const master = await MasterManager.UpsertMaster({
            discriminator: 'IMasterManager',
            id: Number(user.id)
        });
        if (master === false) {
            const result = {
                error: JSON.stringify({ error: 'UpsertMaster failed' })
            };
            return ReturnResult(403, result, origin, {
                accessToken: '',
                refreshToken: ''
            });
        }

        if (master.banned === true) {
            const result = {
                error: JSON.stringify({ error: 'user is banned' })
            };
            return ReturnResult(403, result, origin, {
                accessToken: '',
                refreshToken: ''
            });
        }
        const salt = master.salt;
        if (!salt) {
            const result = {
                error: JSON.stringify({ error: 'salt is undefined' })
            };
            return ReturnResult(403, result, origin, {
                accessToken: '',
                refreshToken: ''
            });
        }

        let role = ZuzonaRole.admin;
        if (user.id === 199163834) {
            role = ZuzonaRole.superadmin;
        }
        const userProfile: TelegramUserProfile = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            photo_url: user.photo_url,
            username: user.username,
            language: master.menuLanguage!,
            role: role
        };

        const accessToken = jwt.sign(userProfile, salt, {
            algorithm: 'HS256',
            expiresIn: process.env.accessTokenExpirationMinutes! + ' minutes'
        });

        const refreshToken = jwt.sign(userProfile, salt, {
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
