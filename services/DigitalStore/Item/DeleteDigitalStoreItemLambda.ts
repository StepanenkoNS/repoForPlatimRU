import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseItemResult, ParseItemResult, ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

//@ts-ignore
import { DigitalStoreManager } from '/opt/DigitalStoreManager';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'digitalStoreCategoryId', datatype: 'string' },
        { key: 'id', datatype: 'string' }
    ]);
    if (bodyObject.success === false) {
        console.log('Error: mailformed JSON body');
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const result = await DigitalStoreManager.DeleteDigitalStoreItem({
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        digitalStoreCategoryId: TextHelper.SanitizeToDirectText(bodyObject.data.digitalStoreCategoryId),
        id: TextHelper.SanitizeToDirectText(bodyObject.data.id)
    });

    const deleteResult = ParseItemResult(result);

    return ReturnRestApiResult(deleteResult.code, deleteResult.body, false, origin, renewedToken);
}
