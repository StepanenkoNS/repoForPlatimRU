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
                // let adminText = 'Новый пользователь зарегистрирован и подписан на контент план ' + request.contentPlanId + ' в рамках плана подписки ' + request.userSubscriptionPlanId;
                // let userText = 'Вы были успешно зарегистрированы и подписаны на контент план ' + request.contentPlanId + ' в рамках плана подписки ' + request.userSubscriptionPlanId;
                // const msgIdAdmin = ksuid.randomSync(new Date()).string;
                // await MessageSender.QueueSendGenericMessage({
                //     discriminator: 'IScheduledGenericMessage',
                //     botId: Number(request.botId),
                //     masterId: Number(request.masterId),
                //     chatId: Number(request.masterId),
                //     sendMethod: ETelegramSendMethod.sendMessage,
                //     message: {
                //         id: msgIdAdmin,
                //         attachments: [],
                //         text: adminText
                //     }
                // });
                // const msgIdUser = ksuid.randomSync(new Date()).string;
                // await MessageSender.QueueSendGenericMessage({
                //     discriminator: 'IScheduledGenericMessage',
                //     botId: Number(request.botId),
                //     masterId: Number(request.masterId),
                //     chatId: Number(request.chatId),
                //     sendMethod: ETelegramSendMethod.sendMessage,
                //     message: {
                //         id: msgIdUser,
                //         attachments: [],
                //         text: userText,
                //         reply_markup: undefined
                //     }
                // });
            } else {
                //шлем сообщение админу, что операция провалилась
                const msgIdAdmin = ksuid.randomSync(new Date()).string;
                await MessageSender.QueueSendGenericMessage({
                    discriminator: 'IScheduledGenericMessage',
                    botId: request.botId,
                    masterId: request.masterId,
                    chatId: request.masterId,
                    sendMethod: ETelegramSendMethod.sendMessage,
                    message: {
                        id: msgIdAdmin,
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
