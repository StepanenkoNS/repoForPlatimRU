import { TextHelper } from '/opt/TextHelpers/textHelper';

import { SQSEvent } from 'aws-lambda';

import { MessagingBotManager } from '/opt/MessagingBotManager';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('DeleteBotData - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const parsedInputData = JSON.parse(record.body) as { botId: number; masterId: number };
            const deleteResult = await MessagingBotManager.DeleteBotData({ masterId: parsedInputData.masterId, botId: parsedInputData.botId });
            if (deleteResult == false) {
                throw 'Error deleting batch, deleteResult=false';
            }
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
