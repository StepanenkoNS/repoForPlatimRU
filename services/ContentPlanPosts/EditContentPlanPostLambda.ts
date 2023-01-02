import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseUpdateItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore

export async function EditContentPlanPostHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'messages', datatype: 'array' },
        { key: 'interaction', datatype: 'object', objectKeys: [] },
        { key: 'draft', datatype: 'boolean' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.UpdateContentPlanPost({
        chatId: telegramUser.id,
        contentPlanPost: {
            id: bodyObject.id,
            contentPlanId: bodyObject.contentPlanId,

            name: bodyObject.name,

            trigger: bodyObject.trigger,
            messages: bodyObject.messages,

            interaction: bodyObject.interaction,
            draft: bodyObject.draft
        }
    });

    const updateResult = ParseUpdateItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
