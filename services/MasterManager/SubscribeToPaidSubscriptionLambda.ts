import { TextHelper } from '/opt/TextHelpers/textHelper';

import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { SupportedCurrenciesArray } from '/opt/PaymentTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore

import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'lengthInDays', datatype: 'number(positiveInteger)' },
        { key: 'subscriptionPlan', datatype: ['PAIDCHANNEL', 'PAIDBOT'] },
        { key: 'subscriptionLevel', datatype: 'number(positiveInteger)' },
        { key: 'pricePaid', datatype: 'number(positiveInteger)' },
        { key: 'currency', datatype: SupportedCurrenciesArray }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    if (Number(telegramUser.id) === 199163834) {
        const result = await PomponaSubscriptionsProcessor.AddSubscription({
            masterId: Number(telegramUser.id),
            lengthInDays: Number(TextHelper.SanitizeToDirectText(bodyObject.data.lengthInDays)),
            subscriptionPlan: TextHelper.SanitizeToDirectText(bodyObject.data.subscriptionPlan) as any,
            subscriptionLevel: Number(TextHelper.SanitizeToDirectText(bodyObject.data.subscriptionLevel)),
            pricePaid: Number(TextHelper.SanitizeToDirectText(bodyObject.data.pricePaid)),
            currency: TextHelper.SanitizeToDirectText(bodyObject.data.currency) as any
        });
        const addResult = ParseItemResult(result);
        return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
    }

    return ReturnRestApiResult(403, { success: false, error: 'forbidden' }, false, origin, renewedToken);
}
