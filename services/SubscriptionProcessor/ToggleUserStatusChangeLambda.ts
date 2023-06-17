import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';

import ksuid from 'ksuid';

import { MessageSender } from '/opt/MessageSender';
//@ts-ignore
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';

import { EAllowSendMessage, ETelegramSendMethod } from 'tgbot-project-types/TypesCompiled/TelegramTypesPrimitive';

import { IScheduleContentPlan } from 'tgbot-project-types/TypesCompiled/ContentTypes';
import { IUserStatusToggler } from 'tgbot-project-types/TypesCompiled/MessagingBotManagerTypes';
import { message } from 'telegram/client';
import { EScheduledMessageStatus } from 'tgbot-project-types/TypesCompiled/GeneralTypes';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log(JSON.stringify(event));

    for (const record of event.Records) {
        try {
            const request = JSON.parse(record.body) as IUserStatusToggler;
            //для сообщение с типом - Запрет - надо найти все предстоящие зашедуленные посты в статусе отличном от BLOCKED

            const scheduledMessages = await MessagingBotSubscriptionManager.ListScheduledMessagesByUser({
                key: {
                    masterId: request.masterId,
                    botId: request.botId,
                    chatId: request.chatId
                },
                filterByBlocked: {
                    status: request.allowSendMessage
                }
            });
            const promises: Promise<any>[] = [];
            scheduledMessages.forEach((scheduledMessage) => {
                const promise = MessagingBotSubscriptionManager.UpdateScheduledMessageStatus({
                    masterId: scheduledMessage.masterId,
                    botId: scheduledMessage.botId,
                    PK: scheduledMessage.PK,
                    SK: scheduledMessage.SK,
                    toStatus: request.allowSendMessage == EAllowSendMessage.ALLOW ? EScheduledMessageStatus.SCHEDULED : EScheduledMessageStatus.BLOCKED
                });
                promises.push(promise);
            });

            await Promise.all(promises);
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
