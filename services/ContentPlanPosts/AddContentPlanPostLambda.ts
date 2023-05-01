import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { ContentConfigurator } from '/opt/ContentConfigurator';
import ksuid from 'ksuid';
import { SQS } from 'aws-sdk';
//@ts-ignore

const sqs = new SQS({ region: process.env.region });
export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'contentPlanId', datatype: 'string' },
        { key: 'sendMethod', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'message', datatype: 'object', objectKeys: [] },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'interaction', datatype: 'object', objectKeys: [] }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.AddContentPlanPost({
        botId: Number(bodyObject.data.botId),
        masterId: Number(telegramUser.id),
        discriminator: 'IContentPlanPost',

        contentPlanId: bodyObject.data.contentPlanId,
        sendMethod: bodyObject.data.sendMethod,
        name: bodyObject.data.name,

        message: bodyObject.data.message,
        trigger: bodyObject.data.trigger,
        interaction: bodyObject.data.interaction
    });

    if (result !== false) {
        //делаем push в SQS
        try {
            const post = { masterId: result.masterId, botId: result.botId, contentPlanId: result.contentPlanId, contentPlanPostId: result.id!, trigger: result.trigger };

            const messageGroupId: string = '#POSTID#' + result.id!;
            const id = ksuid.randomSync(new Date()).string;
            const messageParams: SQS.SendMessageRequest = {
                QueueUrl: process.env.AddScheduledPostQueueURL!,
                MessageBody: JSON.stringify(post),
                MessageDeduplicationId: id,
                MessageGroupId: messageGroupId
            };
            await sqs.sendMessage(messageParams).promise();
        } catch (error) {
            console.log('sqs send error', sqs);
        }
    }

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
