import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingArray, ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore
import { EContentPlanType } from '/opt/ContentTypes';

export async function AddContentPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        // { key: 'type', datatype: [EContentPlanType.INTERACTIVE.toString(), EContentPlanType.SCHEDULLED.toString()] },
        { key: 'price', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'currency', datatype: 'string' },
        { key: 'lengthInDays', datatype: 'number(positiveInteger)' },
        { key: 'description', datatype: 'string' },
        { key: 'enabled', datatype: 'boolean' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const contentPlan = {
        BOTUUID: bodyObject.BOTUUID,
        name: bodyObject.name,
        price: bodyObject.price,
        currency: bodyObject.currency,
        lengthInDays: bodyObject.lengthInDays,
        description: bodyObject.description,
        enabled: bodyObject.enabled
    };

    console.log(contentPlan);

    const result = await ContentConfigurator.AddContentPlan({
        chatId: telegramUser.id,
        contentPlan: contentPlan
    });

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
