import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent } from 'aws-lambda';
//@ts-ignore
import { CreateNewTokens } from 'opt/AuthHelpers/GetNewToken';
import { LogOut, ReturnResult } from 'opt/AuthHelpers/ReturnResult';
//@ts-ignore
import { ValidateTokenFromCookies } from 'opt/AuthHelpers/ValidateTokenFromCookies';
//@ts-ignore
import { TelegramUserProfile, PomponaRole } from 'tgbot-project-types/TypesCompiled/AuthTypes';
import { MasterManager } from 'opt/MasterManager';
import { RefreshTokenFromCookie } from 'opt/AuthHelpers/RefreshToken';
import { PomponaSubscriptionsProcessor } from 'opt/PomponaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent) {
    console.log('event\n', JSON.stringify(event));
    // const master = await MasterManager.UpsertMaster({
    //     masterId: Number(userProfile.id),
    //     photoUrl: userProfile.photo_url,
    //     userName: userProfile.username
    // });

    // if (master.success === false || !master.data) {
    //     const err = {
    //         error: JSON.stringify({ error: 'BotManager.GetOrCreate error' })
    //     };
    //     console.log('Error:ValidateTokenFromCookies\n', err);
    //     throw err;
    // }
    // masterData = master.data;

    // userProfile.pomponaSubscription = masterData.pomponaSubscription;

    // if (master.data.banned === true) {
    //     const err = {
    //         error: JSON.stringify({ error: 'user is banned' })
    //     };
    //     console.log('Error:ValidateTokenFromCookies', err);
    //     throw err;
    // }
    if (!event) {
        const result = {
            error: 'Error: event is not defined'
        };

        return ReturnResult(422, result, '*');
    }
    let origin = 'https://pompona.net';
    if (event.headers && event.headers.origin) {
        //todo - удалить перед деплоем
        const array = process.env.allowedOrigins!.split(',');
        if (array.includes(origin)) {
            origin = event.headers.origin;
        }
    }

    if (event.resource === '/getToken' && event.httpMethod === 'POST') {
        if (!event.requestContext || !event.requestContext.resourcePath) {
            const result = {
                error: 'Error: event requestContext improperly  defined'
            };
            return ReturnResult(422, result, origin);
        }

        let bodyObject: any;
        try {
            bodyObject = JSON.parse(event.body!);
        } catch (error) {
            const result = {
                error: 'Error: mailformed body - invalid JSON object'
            };
            return ReturnResult(422, result, origin);
        }
        try {
            if (process.env.AllowUsers && process.env.AllowUsers != '') {
                const usersArray = process.env.AllowUsers!.split(',');
                console.log('usersArray', usersArray);

                if (usersArray.length > 0) {
                    if (!usersArray.includes(bodyObject.id.toString())) {
                        return { effect: 'Deny', message: 'Guarded mode: only allowed users' };
                    }
                }
                console.log('user is allowed to proceed');
            }
        } catch (error) {
            console.log('Allowed users detection failed', error);
        }
        try {
            const result = await CreateNewTokens(bodyObject, origin);
            return result;
        } catch (error) {
            const result = {
                error: 'Error: CreateNewTokens failed'
            };
            return ReturnResult(422, result, origin);
        }
    }

    if (event.resource === '/me' && event.httpMethod === 'GET') {
        const validateTokenResult = await ValidateTokenFromCookies(event);
        if (validateTokenResult.effect === 'Deny') {
            const result = {
                error: 'Error: not authorized'
            };
            return ReturnResult(401, result, origin);
        } else {
            let role = validateTokenResult.userProfile.role;
            if (validateTokenResult.userProfile.id === 199163834) {
                role = PomponaRole.superadmin;
            }

            const master = await MasterManager.UpsertMaster({
                masterId: Number(validateTokenResult.userProfile.id),
                photoUrl: validateTokenResult.userProfile.photo_url,
                userName: validateTokenResult.userProfile.username
            });

            if (master.success === false || !master.data) {
                return ReturnResult(422, { error: 'master is undefined' }, origin);
            }

            const userProfile: TelegramUserProfile = {
                id: validateTokenResult.userProfile.id,
                first_name: validateTokenResult.userProfile.first_name,
                last_name: validateTokenResult.userProfile.last_name,
                photo_url: validateTokenResult.userProfile.photo_url,
                username: validateTokenResult.userProfile.username,
                language: validateTokenResult.userProfile.language,
                role: role,
                pomponaSubscription: PomponaSubscriptionsProcessor.TurnSubscriptionIntoShort(master.data.pomponaSubscription)
            };
            const tokens = RefreshTokenFromCookie(userProfile);

            return ReturnResult(201, { userProfile: userProfile }, origin, {
                accessToken: tokens.accessToken
            });
        }
    }

    if (event.resource === '/logOut' && event.httpMethod === 'GET') {
        return LogOut(origin);
    }
    return ReturnResult(404, 'not found', origin);
}
