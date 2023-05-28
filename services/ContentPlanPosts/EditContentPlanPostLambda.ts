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
import { SchemaValidator } from '/opt/YUP/SchemaValidator';

import { ContentConfigurator } from '/opt/ContentConfigurator';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'id', datatype: 'string' },
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'sendMethod', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'message', datatype: 'object', objectKeys: [] },
        { key: 'interaction', datatype: 'object', objectKeys: [] }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    const potentialContentPlanPost = {
        masterId: Number(telegramUser.id),

        id: TextHelper.SanitizeToDirectText(bodyObject.data.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        contentPlanId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanId),

        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        sendMethod: TextHelper.SanitizeToDirectText(bodyObject.data.sendMethod) as any,

        trigger: bodyObject.data.trigger,
        message: bodyObject.data.message,

        interaction: bodyObject.data.interaction
    };

    const schemaValidationResult = await SchemaValidator.ContentPlanPost_Validator(potentialContentPlanPost);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return ReturnRestApiResult(422, { error: schemaValidationResult.error }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.UpdateContentPlanPost(schemaValidationResult.item as any);

    const updateResult = ParseItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
