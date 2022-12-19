import { Context, APIGatewayEvent } from 'aws-lambda';
import { LogOut, ReturnResult } from '../utils/ReturnResult';
import { CreateNewTokens } from '../utils/GetNewToken';
import { ValidateTokenFromCookies } from '../utils/ValidateTokenFromCookies';
import { TelegramUserProfile } from '../utils/Types';

export async function LambdaTokenServiceHandler(event: APIGatewayEvent, context: Context) {
    console.log('event\n', JSON.stringify(event));
    if (!event) {
        const result = {
            error: 'Error: event is not defined'
        };

        return ReturnResult(422, result, '*');
    }
    let origin = 'https://zuzona.com';
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
            const userProfile: TelegramUserProfile = {
                id: validateTokenResult.userProfile.id,
                first_name: validateTokenResult.userProfile.first_name,
                last_name: validateTokenResult.userProfile.last_name,
                photo_url: validateTokenResult.userProfile.photo_url,
                username: validateTokenResult.userProfile.username,
                language: validateTokenResult.userProfile.language,
                role: 'admin'
            };
            if (validateTokenResult.context.renewedAccessToken) {
                return ReturnResult(201, { userProfile: userProfile }, origin, {
                    accessToken: validateTokenResult.context.renewedAccessToken
                });
            } else {
                return ReturnResult(200, { userProfile: userProfile }, origin);
            }
        }
    }

    if (event.resource === '/logOut' && event.httpMethod === 'GET') {
        return LogOut(origin);
    }
    return ReturnResult(404, 'not found', origin);
}
