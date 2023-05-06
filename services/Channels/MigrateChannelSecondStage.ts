import { SQSEvent } from 'aws-lambda';
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { defaultLocale } from '/opt/LocaleTypes';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            //console.log('record', record);

            const request = JSON.parse(record.body) as { masterId: number; botId: number; channelId: number; chatId: number; userName: string | null; subscriptionPlanId: string };

            await MessagingBotManager.UpsertBotUser({
                botId: request.botId,
                id: request.chatId,
                masterId: request.masterId,
                menuLanguage: defaultLocale,
                userName: request.userName,
                channelMigration: {
                    subscriptionPlanId: request.subscriptionPlanId
                }
            });
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
