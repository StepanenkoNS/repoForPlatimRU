import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';

export async function handler(event: SQSEvent) {
    const batchItemFailures: any[] = [];
    console.log('SendMessage-Scheduller-Second-Stage event', JSON.stringify(event));
    console.log('number of sqs records', event.Records.length);
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body) as {
                PK: string;
                SK: string;
                sendDate: string;
                userSubscriptionPlanId: string;
                contentPlanId: string;
                contentPlanPostId: string;
                masterId: number;
                botId: number;
                chatId: number;
            }[];
            console.log('number of items in the body', body.length);
            let i = 1;
            for (const item of body) {
                console.log('processing item ', i);
                i++;
                try {
                    const result = await MessagingBotSubscriptionManager.SchedullerSecondStage(item);
                    if (result == false) {
                        throw 'Error:MessagingBotSubscriptionManager.SchedullerSecondStage result is false';
                    }
                } catch (error) {
                    throw error;
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
