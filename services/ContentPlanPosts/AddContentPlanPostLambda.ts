import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingArray, ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore

export async function AddContentPlanPostHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'draft', datatype: 'boolean' },
        { key: 'messages', datatype: 'array' },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'interaction', datatype: 'object', objectKeys: [] }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.AddContentPlanPost({
        chatId: telegramUser.id,
        contentPlanPost: {
            contentPlanId: bodyObject.contentPlanId,
            name: bodyObject.name,
            draft: bodyObject.draft,
            messages: bodyObject.messages,
            trigger: bodyObject.trigger,
            interaction: bodyObject.interaction
        }
    });

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
