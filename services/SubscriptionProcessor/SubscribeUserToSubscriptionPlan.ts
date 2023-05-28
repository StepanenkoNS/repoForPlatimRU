import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';

import { MessageSender } from '/opt/MessageSender';

import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { ETelegramCallbackTypeKey, PayloadType, TelegramCallbackPayload } from '/opt/TelegramCallbackPayload';

import { IChannelSubscription, ISubscribeUserToSubscriptionPlan } from '/opt/UserSubscriptionTypes';

const sqs = new SQS({ region: process.env.region });

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);

            const request = JSON.parse(record.body) as ISubscribeUserToSubscriptionPlan;

            let replyMarkup = null;
            //подписываем на бота
            switch (request.type) {
                case 'BOT': {
                    const subscribeToBot = await MessagingBotSubscriptionManager.SubscribeToSubscriptionPlanBot({
                        botId: request.botId,
                        chatId: request.chatId,
                        masterId: request.masterId,
                        userSubscriptionPlanId: request.userSubscriptionPlanId,
                        pricePaid: request.pricePaid,
                        currency: request.currency,
                        paymentId: request.paymentId
                    });

                    if (subscribeToBot.success == false || !subscribeToBot.data) {
                        throw 'SubscribeToSubscriptionPlanBot failed';
                    }
                    await MessageSender.QueueSendPlainMessage({
                        botId: Number(request.botId),
                        masterId: Number(request.masterId),
                        chatId: Number(request.chatId),
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            attachments: [],
                            text: 'Вы были успешно подписаны'
                        }
                    });
                    break;
                }
                case 'CHANNEL': {
                    const subscribeToChannel = await MessagingBotSubscriptionManager.SubscribeToSubscriptionPlanChannel({
                        botId: request.botId,
                        chatId: request.chatId,
                        masterId: request.masterId,
                        channelId: request.channelId!,
                        userSubscriptionPlanId: request.userSubscriptionPlanId,
                        pricePaid: request.pricePaid,
                        currency: request.currency,
                        paymentId: request.paymentId
                    });

                    if (subscribeToChannel.success === false || !subscribeToChannel.data) {
                        throw 'SubscribeToSubscriptionPlanChannel failed';
                    }

                    const callbackDataJoin: PayloadType = {
                        //id: request.id!,
                        callBack: ETelegramCallbackTypeKey.JoinChannel,
                        channelId: Number((subscribeToChannel.data as IChannelSubscription).channelId),
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
                    await MessageSender.QueueSendPlainMessage({
                        botId: Number(request.botId),
                        masterId: Number(request.masterId),
                        chatId: Number(request.chatId),
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            attachments: [],
                            text: 'Вы были успешно подписаны на канал, нажмите на кнопку чтобы присоединиться',
                            reply_markup: replyMarkup
                        }
                    });
                    break;
                }
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
