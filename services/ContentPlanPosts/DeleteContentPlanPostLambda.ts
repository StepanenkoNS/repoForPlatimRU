import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ReturnRestApiResult, ParseDeleteItemResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';

export async function DeleteContentPlanPostHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'contentPlanId', datatype: 'string' }
    ]);
    if (bodyObject === false) {
        console.log('Error: mailformed JSON body');
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.DeleteContentPlanPost(telegramUser.id, bodyObject.BOTUUID, bodyObject.contentPlanId, bodyObject.id);

    const deleteResult = ParseDeleteItemResult(result);

    return ReturnRestApiResult(deleteResult.code, deleteResult.body, false, origin, renewedToken);
}
