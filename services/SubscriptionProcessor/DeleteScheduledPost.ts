import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';

//@ts-ignore
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            //console.log('record', record);

            const request = JSON.parse(record.body) as { masterId: number; botId: number; contentPlanId: string; contentPlanPostId: string };

            const data = { masterId: request.masterId, botId: request.botId, contentPlanId: request.contentPlanId, contentPlanPostId: request.contentPlanPostId };

            const deleteScheduledPostResult = await MessagingBotSubscriptionManager.Scheduleler_DeletePost(data);

            if (deleteScheduledPostResult === false) {
                console.log('Error in Scheduleler_DeletePost', data);
                batchItemFailures.push({ itemIdentifier: record.messageId });
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
