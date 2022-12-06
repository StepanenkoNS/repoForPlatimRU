import { AWSPolicyGenerator } from '../utils/AWSPolicyGenerator';
import { ValidateTokenFromCookies } from '../utils/ValidateTokenFromCookies';

export async function LambdaJWTAuthorizerHandler(event: any, context: any) {
    console.log('event\n', event);
    const validateTokenResult = await ValidateTokenFromCookies(event);

    if (validateTokenResult.effect === 'Deny') {
        console.log('Deny');
        return AWSPolicyGenerator.generate('undefined', 'Deny', event.methodArn);
    } else {
        console.log('allow');
        console.log('validateTokenResult.context\n', validateTokenResult.context);
        return AWSPolicyGenerator.generate(validateTokenResult.principalId, validateTokenResult.effect, event.methodArn, validateTokenResult.context);
    }
}
