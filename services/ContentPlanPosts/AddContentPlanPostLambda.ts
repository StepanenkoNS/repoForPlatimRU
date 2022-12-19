import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
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
        { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 'paid', datatype: 'boolean' },
        { key: 'price', datatype: 'number(positive)' },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'messages', datatype: 'array' },
        { key: 'previewMessages', datatype: 'array' },
        { key: 'name', datatype: 'string' },
        { key: 'interaction', datatype: 'object', objectKeys: [] },
        { key: 'draft', datatype: 'boolean' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.AddContentPlanPost({
        chatId: telegramUser.id,
        contentPlanPost: {
            contentPlanId: bodyObject.contentPlanId,
            orderN: bodyObject.orderN,
            name: bodyObject.name,
            paid: bodyObject.paid,
            price: bodyObject.price,
            trigger: bodyObject.trigger,
            messages: bodyObject.messages,
            previewMessages: bodyObject.previewMessages,
            interaction: bodyObject.interaction,
            draft: bodyObject.draft
        }
    });

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
