import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseUpdateItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore
import { EContentPlanType } from '/opt/ContentTypes';

export async function EditContentPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'id', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'price', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'currency', datatype: 'string' },
        { key: 'lengthInDays', datatype: 'number(positiveInteger)' },
        { key: 'description', datatype: 'string' },
        { key: 'enabled', datatype: 'boolean' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.UpdateContentPlan({
        chatId: telegramUser.id,

        contentPlan: {
            id: bodyObject.id,
            BOTUUID: bodyObject.BOTUUID,
            name: bodyObject.name,
            price: bodyObject.price,
            currency: bodyObject.currency,
            lengthInDays: bodyObject.lengthInDays,
            description: bodyObject.description,
            enabled: bodyObject.enabled
        }
    });

    const updateResult = ParseUpdateItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
