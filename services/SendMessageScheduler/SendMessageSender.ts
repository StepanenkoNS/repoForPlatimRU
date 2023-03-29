import { APIGatewayEvent, APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ddbDocClient } from '/opt/DDB/ddbDocClient';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
import { IScheduledPostMessage } from '/opt/ContentTypes';
import MessageSender from '/opt/MessageSender';

export async function SendMessageSenderHandler(event: SQSEvent) {
    const batchItemFailures: any[] = [];
    console.log('SendMessageSchedullerHandler - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            if (body.discriminator === 'IScheduledPostMessage') {
                const post = await ContentConfigurator.GetMyContentPlanPostById({ masterId: body.masterId, botId: Number(body.botId), contentPlanId: body.contentPlanId, id: body.contentPlanPostId });
                //console.log('post', post);
                if (post === false) {
                    throw 'Post not found';
                }
                const result = await MessageSender.SendScheduledMessage(body);
                if (result !== true) {
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
            }
            if (body.discriminator === 'IRequestForPaymentConfirmation') {
                const result = await MessageSender.SendPaymentMethodToAdmin(body);
                if (result !== true) {
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
            }
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    return { batchItemFailures };
}
