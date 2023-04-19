import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';

//@ts-ignore
import MessageSender from '/opt/MessageSender';

//@ts-ignore
import MessagingBotSubscriptionManager from '/opt/MessagingBotSubscriptionManager';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { TelegramCallbackPayload } from '../../../TGBot-CoreLayers/LambdaLayers/Models/TelegramCallbackPayload';
import UserSubscriptionPlanChannel from '/opt/UserSubscriptionPlanChannel';
import { ISubscribeUser } from '/opt/UserSubscriptionTypes';

const sqs = new SQS({ region: process.env.region });

export async function SubscribeUserToSubscriptionPlanHandler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);

            const request = JSON.parse(record.body) as ISubscribeUser;

            let subscriptionResult = false;
            let replyMarkup = undefined;
            //подписываем на бота
            switch (request.type) {
                case 'BOT': {
                    subscriptionResult = await MessagingBotSubscriptionManager.SubscribeToContentPlanBotStatic({
                        botId: request.botId,
                        chatId: request.chatId,
                        masterId: request.masterId,
                        userSubscriptionPlanId: request.userSubscriptionPlanId
                    });
                    break;
                }
                case 'CHANNEL': {
                    subscriptionResult = await MessagingBotSubscriptionManager.SubscribeToContentPlanChannelStatic({
                        botId: request.botId,
                        chatId: request.chatId,
                        masterId: request.masterId,
                        userSubscriptionPlanId: request.userSubscriptionPlanId
                    });

                    const plan = await UserSubscriptionPlanChannel.GetUserSubscriptionPlanChannelById({
                        masterId: request.masterId,
                        botId: request.botId,
                        id: request.userSubscriptionPlanId
                    });
                    if (plan === false) {
                        console.log('plan not founde');
                        return false;
                    }
                    const callbackDataJoin = {
                        id: request.id!,
                        type: 'JoinChannel',
                        channelId: Number(plan.channelId),
                        chatId: Number(request.chatId)
                    };

                    replyMarkup = {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Join',
                                    callback_data: TelegramCallbackPayload.EncodePayload(callbackDataJoin)
                                }
                            ]
                        ]
                    };
                    const msgIdUser = ksuid.randomSync(new Date()).string;
                    await MessageSender.QueueSendGenericMessage({
                        discriminator: 'IScheduledGenericMessage',
                        botId: Number(request.botId),
                        masterId: Number(request.masterId),
                        chatId: Number(request.chatId),
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            id: msgIdUser,
                            attachments: [],
                            text: 'Вы были успешно подписаны на канал, нажмите на кнопку чтобы присоединиться',
                            reply_markup: replyMarkup
                        }
                    });
                    break;
                }
            }

            // if (subscriptionResult === true) {
            //     let adminText = 'Пользователь был успешно подписан';
            //     let userText = 'Вы были успешно подписаны';

            //     const msgIdAdmin = ksuid.randomSync(new Date()).string;
            //     await MessageSender.QueueSendGenericMessage({
            //         discriminator: 'IScheduledGenericMessage',
            //         botId: Number(request.botId),
            //         masterId: Number(request.masterId),
            //         chatId: Number(request.masterId),
            //         sendMethod: ETelegramSendMethod.sendMessage,
            //         message: {
            //             id: msgIdAdmin,
            //             attachments: [],
            //             text: adminText
            //         }
            //     });

            //     const msgIdUser = ksuid.randomSync(new Date()).string;
            //     await MessageSender.QueueSendGenericMessage({
            //         discriminator: 'IScheduledGenericMessage',
            //         botId: Number(request.botId),
            //         masterId: Number(request.masterId),
            //         chatId: Number(request.chatId),
            //         sendMethod: ETelegramSendMethod.sendMessage,
            //         message: {
            //             id: msgIdUser,
            //             attachments: [],
            //             text: userText,
            //             reply_markup: replyMarkup
            //         }
            //     });
            // } else {
            //     //шлем сообщение админу, что операция провалилась
            //     const msgIdAdmin = ksuid.randomSync(new Date()).string;
            //     await MessageSender.QueueSendGenericMessage({
            //         discriminator: 'IScheduledGenericMessage',
            //         botId: request.botId,
            //         masterId: request.masterId,
            //         chatId: request.masterId,
            //         sendMethod: ETelegramSendMethod.sendMessage,
            //         message: {
            //             id: msgIdAdmin,
            //             attachments: [],
            //             text: 'Платеж был успешно подтвержден, но подписки добавить не удалось. Свяжитесь с технической поддержкой'
            //         }
            //     });
            // }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
