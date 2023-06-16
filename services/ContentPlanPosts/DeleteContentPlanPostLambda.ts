import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from 'opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';

import { ContentConfigurator } from 'opt/ContentConfigurator';
import { SQS } from 'aws-sdk';

const sqs = new SQS({ region: process.env.region });
export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'contentPlanId', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        console.log('Error: mailformed JSON body');
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'DELETE',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const result = await ContentConfigurator.DeleteContentPlanPost({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        contentPlanId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanId),
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id)
    });

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'DELETE',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
