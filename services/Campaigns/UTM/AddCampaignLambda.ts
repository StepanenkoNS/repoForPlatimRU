import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { UTMManager } from '/opt/CampaignManager';
import { EAllowedUTMs, IAddCampaignUTM } from 'tgbot-project-types/TypesCompiled/CampaignTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },

        { key: 'tags', datatype: 'array' },
        { key: 'utmType', datatype: Object.keys(EAllowedUTMs) },
        { key: 'utmValue', datatype: 'string' },
        { key: 'description', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const addCampaign: IAddCampaignUTM = {
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        masterId: Number(telegramUser.id),
        utmType: TextHelper.SanitizeToDirectText(bodyObject.data.utmType) as EAllowedUTMs,
        utmValue: TextHelper.SanitizeToDirectText(bodyObject.data.utmValue),

        description: TextHelper.SanitizeToDirectText(bodyObject.data.description),
        tags: bodyObject.data.tags
    };

    const result = await UTMManager.AddCampaign(addCampaign);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ADD',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
