import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
//@ts-ignore
import { IRequestToConfirmPayment } from '/opt/PaymentTypes';
//@ts-ignore
import PaymentOptionsManager from '/opt/PaymentOptionsManager';
//@ts-ignore
import MessageSender from '/opt/MessageSender';
//@ts-ignore
import { UserBotProfile } from '/opt/MessagingBotUserBotProfile';

import { TelegramCallbackPayload } from '/opt/TelegramCallbackPayload';
import UserSubscriptionPlanChannel from '/opt/UserSubscriptionPlanChannel';
import { ETelegramSendMethod } from '../../../TGBot-CoreLayers/LambdaLayers/Types/TelegramTypes';

const sqs = new SQS({ region: process.env.region });

export async function IncomingPaymentConfirmationHandler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingPaymentConfirmation - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);

            const request = JSON.parse(record.body) as IRequestToConfirmPayment;

            //определяем, что за тип подписки

            const paymentDetails = await PaymentOptionsManager.GetPaymentRequest({
                botId: request.botId,
                masterId: Number(request.masterId),
                paymentId: request.id
            });

            console.log('paymentDetails', paymentDetails);

            if (paymentDetails === false) {
                return false;
            }
            //это долгая подписка на бота

            const updatePaymentResult = await PaymentOptionsManager.ConfirmDIRECTPaymentRequest(request);

            if (updatePaymentResult === false) {
                //посылаем сообщение, что не удалось обновить
                const sendResultAdmin = await MessageSender.SendTextMessage({
                    botId: request.botId,
                    masterId: request.masterId,
                    recipientChatId: request.masterId,
                    text: 'Этот платеж был обработан ранее'
                });
            } else {
                let result = false;

                //подписываем на бота
                if (paymentDetails.subscriptionTarget === 'BOT') {
                    result = await UserBotProfile.SubscribeToContentPlanBotStatic({
                        botId: updatePaymentResult.botId,
                        chatId: updatePaymentResult.chatId,
                        masterId: updatePaymentResult.masterId,
                        userSubscriptionPlanId: updatePaymentResult.subscriptionPlanId
                    });
                }
                let replyMarkup = undefined;
                if (paymentDetails.subscriptionTarget === 'CHANNEL') {
                    result = await UserBotProfile.SubscribeToContentPlanChannelStatic({
                        botId: updatePaymentResult.botId,
                        chatId: updatePaymentResult.chatId,
                        masterId: updatePaymentResult.masterId,
                        userSubscriptionPlanId: updatePaymentResult.subscriptionPlanId
                    });

                    const plan = await UserSubscriptionPlanChannel.GetUserSubscriptionPlanChannelById({
                        masterId: updatePaymentResult.masterId,
                        botId: updatePaymentResult.botId,
                        id: updatePaymentResult.subscriptionPlanId
                    });
                    if (plan === false) {
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
                }

                if (result === true) {
                    let adminText = 'Пользователь был успешно подписан';
                    let userText = 'Вы были успешно подписаны';

                    if (request.action.toString() === '0') {
                        adminText = 'Платеж успешно отклонен.';
                        userText = 'Ваш платеж был отклонен администратором';
                    }

                    const msgIdAdmin = ksuid.randomSync(new Date()).string;
                    await MessageSender.QueueSendGenericMessage({
                        discriminator: 'IScheduledGenericMessage',
                        botId: updatePaymentResult.botId,
                        masterId: updatePaymentResult.masterId,
                        chatId: updatePaymentResult.masterId,
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            id: msgIdAdmin,
                            attachments: [],
                            text: adminText
                        }
                    });

                    const msgIdUser = ksuid.randomSync(new Date()).string;
                    await MessageSender.QueueSendGenericMessage({
                        discriminator: 'IScheduledGenericMessage',
                        botId: Number(updatePaymentResult.botId),
                        masterId: Number(updatePaymentResult.masterId),
                        chatId: Number(updatePaymentResult.chatId),
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            id: msgIdUser,
                            attachments: [],
                            text: userText,
                            reply_markup: replyMarkup
                        }
                    });
                } else {
                    //шлем сообщение админу, что операция провалилась
                    const msgIdAdmin = ksuid.randomSync(new Date()).string;
                    await MessageSender.QueueSendGenericMessage({
                        discriminator: 'IScheduledGenericMessage',
                        botId: updatePaymentResult.botId,
                        masterId: updatePaymentResult.masterId,
                        chatId: updatePaymentResult.masterId,
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            id: msgIdAdmin,
                            attachments: [],
                            text: 'Платеж был успешно подтвержден, но подписки добавить не удалось. Свяжитесь с технической поддержкой'
                        }
                    });
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
