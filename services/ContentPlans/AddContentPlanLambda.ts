import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseDeleteItemResult, ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore
import { EContentPlanType, IContentPlan } from '/opt/ContentTypes';

export async function AddContentPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
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

    const contentPlan: IContentPlan = {
        discriminator: 'IContentPlan',
        botId: Number(bodyObject.botId),
        masterId: telegramUser.id,
        name: bodyObject.name.toString(),
        description: bodyObject.description.toString()
    };

    console.log(contentPlan);

    const result = await ContentConfigurator.AddContentPlan(contentPlan);

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
