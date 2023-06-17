import { TextHelper } from '/opt/TextHelpers/textHelper';

import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';

import { SupportedCurrenciesArray } from 'tgbot-project-types/TypesCompiled/PaymentTypes';
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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
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
        const dataResult = ParseItemResult(result);

        return await ReturnRestApiResult({
            statusCode: dataResult.code,
            method: 'GET',
            masterId: Number(telegramUser.id),
            data: dataResult.body,
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    return await ReturnRestApiResult({
        statusCode: 403,
        method: 'EDIT',
        masterId: Number(telegramUser.id),
        data: { success: false, error: 'forbidden' },
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
