import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';

import { MessageSender } from '/opt/MessageSender';
//@ts-ignore
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { IScheduleContentPlan } from '/opt/ContentTypes';

const sqs = new SQS({ region: process.env.region });

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);

            const request = JSON.parse(record.body) as IScheduleContentPlan;

            const subscriptionResult = await MessagingBotSubscriptionManager.ScheduleAllContentPlanPostsOnSubscription(request);

            if (subscriptionResult === true) {
            } else {
                //шлем сообщение админу, что операция провалилась
                const msgIdAdmin = ksuid.randomSync(new Date()).string;
                await MessageSender.QueueSendPlainMessage({
                    discriminator: 'ITelegramMessage',
                    botId: request.botId,
                    masterId: request.masterId,
                    chatId: request.masterId,
                    sendMethod: ETelegramSendMethod.sendMessage,
                    message: {
                        attachments: [],
                        text: 'Платеж был успешно подтвержден, но подписки добавить не удалось. Свяжитесь с технической поддержкой'
                    }
                });
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
