import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';

import ksuid from 'ksuid';

import { MessageSender } from '/opt/MessageSender';
//@ts-ignore
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { IScheduleContentPlan } from '/opt/ContentTypes';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log(JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const request = JSON.parse(record.body);
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
