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

import { ETelegramSendMethod } from '/opt/TelegramTypes';
import { EContentPostInteraction } from '/opt/ContentTypes';

const sqs = new SQS({ region: process.env.region });

export async function IncomingPaymentConfirmationHandler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingPaymentConfirmation - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);
            const request = JSON.parse(record.body) as IRequestToConfirmPayment;
            const updatePaymentResult = await PaymentOptionsManager.ConfirmDIRECTPaymentRequest(request);

            if (updatePaymentResult === false) {
                //посылаем сообщение, что не удалось обновить
                const sendResultAdmin = await MessageSender.SendTextMessage({
                    botId: request.botId,
                    masterId: request.masterId,
                    recipientChatId: request.masterId,
                    text: 'Этот платеж был подтвержден ранее'
                });
            } else {
                const result = await UserBotProfile.SubscribeToContentPlanStatic({
                    botId: updatePaymentResult.botId,
                    chatId: updatePaymentResult.chatId,
                    masterId: updatePaymentResult.masterId,
                    userSubscriptionPlanId: updatePaymentResult.subscriptionPlanId
                });

                if (result === true) {
                    //шлем сообщение что успешно добавлено
                    //админу
                    //пользователю

                    let adminText = 'Пользователь был успешно подписан';
                    let userText = 'Вы были успешно подписаны';
                    if (request.action.toString() === '0') {
                        let adminText = 'Платеж успешно отклонен.';
                        let userText = 'Ваш платеж был отклонен администратором';
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
                            text: adminText,
                            interaction: {
                                type: EContentPostInteraction.NONE
                            }
                        }
                    });

                    const msgIdUser = ksuid.randomSync(new Date()).string;
                    await MessageSender.QueueSendGenericMessage({
                        discriminator: 'IScheduledGenericMessage',
                        botId: updatePaymentResult.botId,
                        masterId: updatePaymentResult.masterId,
                        chatId: updatePaymentResult.masterId,
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            id: msgIdAdmin,
                            attachments: [],
                            text: userText,
                            interaction: {
                                type: EContentPostInteraction.NONE
                            }
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
                            text: 'Платеж был успешно подтвержден, но подписки добавить не удалось. Свяжитесь с технической поддержкой',
                            interaction: {
                                type: EContentPostInteraction.NONE
                            }
                        }
                    });
                }
            }
        } catch (e) {
            console.log('Error in processing SQS consumer: ${record.body}', e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
