import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { ContentConfigurator } from '/opt/ContentConfigurator';
import ksuid from 'ksuid';
import { SQS } from 'aws-sdk';
import { IContentPlanPost } from '/opt/ContentTypes';
import { ZuzonaSubscriptionsProcessor } from '/opt/ZuzonaSubscriptionsProcessor';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';
//@ts-ignore

const sqs = new SQS({ region: process.env.region });
export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'message', datatype: 'object', objectKeys: [] },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'interaction', datatype: 'object', objectKeys: [] }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const potentialContentPlanPost: IContentPlanPost = {
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        masterId: Number(telegramUser.id),

        contentPlanId: TextHelper.SanitizeToDirectText(bodyObject.data.contentPlanId),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),

        message: bodyObject.data.message,
        trigger: bodyObject.data.trigger,
        interaction: bodyObject.data.interaction
    };

    const schemaValidationResult = await SchemaValidator.ContentPlanPost_Validator(potentialContentPlanPost);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return ReturnRestApiResult(422, { error: schemaValidationResult.error }, false, origin, renewedToken);
    }

    const limitsValidationResult = await ZuzonaSubscriptionsProcessor.CheckSubscription_AddContentPlanPost({
        key: {
            masterId: potentialContentPlanPost.masterId,
            botId: potentialContentPlanPost.botId,
            contentPlanId: potentialContentPlanPost.contentPlanId
        },
        userJsonData: telegramUser
    });

    if (limitsValidationResult.success == false || !limitsValidationResult.data) {
        return ReturnRestApiResult(422, { error: 'not valid subscription data' }, false, origin, renewedToken);
    }

    if (limitsValidationResult.success == true && limitsValidationResult.data.allow == false) {
        return ReturnRestApiResult(429, { error: 'Subscription plan limits exceeded' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.AddContentPlanPost(schemaValidationResult.item as any);

    const addResult = ParseItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
