import * as jwt from 'jsonwebtoken';
import { RefreshTokenFromCookie } from '../utils/RefreshToken';
import { TelegramUserProfile } from '../utils/Types';
import { AWSPolicyGenerator } from '../utils/AWSPolicyGenerator';
import { ValidateTokenFromCookies } from '../utils/ValidateTokenFromCookies';

export async function LambdaJWTAuthorizerHandler(event: any, context: any, callback: any) {
    const validateTokenResult = await ValidateTokenFromCookies(event);

    if (validateTokenResult.effect === 'Deny') {
        return AWSPolicyGenerator.generate('undefined', 'Deny', event.methodArn);
    } else {
        return AWSPolicyGenerator.generate(validateTokenResult.principalId, validateTokenResult.effect, event.methodArn, validateTokenResult.context);
    }
}
