import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
//@ts-ignore
import { IRequestToConfirmPayment } from '/opt/PaymentTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

import { MessageSender } from '/opt/MessageSender';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { ISubscribeUser } from '/opt/UserSubscriptionTypes';
//@ts-ignore
import { MasterManager } from '/opt/MasterManager';

const sqs = new SQS({ region: process.env.region });

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingPaymentConfirmation - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);

            const request = JSON.parse(record.body) as IRequestToConfirmPayment;

            //определяем, что за тип подписки

            const paymentDetails = await PaymentOptionsManager.GetPaymentRequest({
                botId: Number(request.botId),
                masterId: Number(request.masterId),
                paymentId: request.id
            });

            console.log('paymentDetails', paymentDetails);

            if (paymentDetails === false) {
                return false;
            }
            //это долгая подписка на бота

            const updatePaymentResult = await PaymentOptionsManager.ConfirmPaymentRequest(request);
            console.log('PaymentOptionsManager.ConfirmPaymentRequest result', updatePaymentResult);

            if (updatePaymentResult === false) {
                //посылаем сообщение админу, что не удалось обновить платеж
                try {
                    await MessageSender.QueueSendGenericMessage({
                        discriminator: 'IScheduledGenericMessage',
                        botId: Number(request.botId),
                        masterId: Number(request.masterId),
                        chatId: Number(request.masterId),
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            id: ksuid.randomSync(new Date()).string,
                            attachments: [],
                            text: 'Этот платеж был обработан ранее',
                            reply_markup: undefined
                        }
                    });
                } catch (error) {
                    console.log('Error:IncomingPaymentConfirmationHandler:MessageSender.QueueSendGenericMessage', error);
                    throw error;
                }
            } else {
                // обновляем количество триальных подписчиков

                if (paymentDetails.subscriptionType === 'CHANNEL') {
                    const endTrialChannel = await MasterManager.IncrementConnectedPaidChannelUsers(Number(request.masterId));
                    if (endTrialChannel) {
                        const msgIdAdmin = ksuid.randomSync(new Date()).string;
                        let text =
                            'Здравствуйте!\n' +
                            'Только что была подтверждена оплата последней подписки в рамках пробного лимита на канал. Это значит, что новые подписчики не смогут подписаться на ваш канал с помощью сервиса zuzona.\nДругих ограничений нет.\nЧтобы продолжить принимать оплаты, оплатите платную PRO-подписку на канал на сайте.\nС уважением, поддержка сервиса';
                        await MessageSender.QueueSendGenericMessage({
                            discriminator: 'IScheduledGenericMessage',
                            botId: paymentDetails.botId,
                            masterId: paymentDetails.masterId,
                            chatId: paymentDetails.masterId,
                            sendMethod: ETelegramSendMethod.sendMessage,
                            message: {
                                id: msgIdAdmin,
                                attachments: [],
                                text: text,
                                reply_markup: {
                                    parse_mode: 'HTML'
                                }
                            }
                        });
                    }
                }

                if (paymentDetails.subscriptionType === 'BOT') {
                    const endTrialChannel = await MasterManager.IncrementConnectedPaidBotUsers(Number(request.masterId));
                    if (endTrialChannel) {
                        const msgIdAdmin = ksuid.randomSync(new Date()).string;
                        let text =
                            'Здравствуйте!\n' +
                            'Только что была подтверждена оплата последней подписки в рамках пробного лимита на бота. Это значит, что новые подписчики не смогут подписаться на ваш канал с помощью сервиса zuzona.\nДругих ограничений нет.\nЧтобы продолжить принимать оплаты, оплатите платную PRO-подписку на канал на сайте.\nС уважением, поддержка сервиса';
                        await MessageSender.QueueSendGenericMessage({
                            discriminator: 'IScheduledGenericMessage',
                            botId: paymentDetails.botId,
                            masterId: paymentDetails.masterId,
                            chatId: paymentDetails.masterId,
                            sendMethod: ETelegramSendMethod.sendMessage,
                            message: {
                                id: msgIdAdmin,
                                attachments: [],
                                text: text,
                                reply_markup: {
                                    parse_mode: 'HTML'
                                }
                            }
                        });
                    }
                }
                // отправляем в очередь на создание подписок
                try {
                    const sqsRequest: ISubscribeUser = {
                        id: request.id,
                        type: paymentDetails.subscriptionType,
                        botId: updatePaymentResult.botId,
                        chatId: updatePaymentResult.chatId,
                        masterId: updatePaymentResult.masterId,
                        userSubscriptionPlanId: updatePaymentResult.subscriptionPlanId
                    };
                    const id = ksuid.randomSync(new Date()).string;
                    const messageParams: SQS.SendMessageRequest = {
                        QueueUrl: process.env.SubscribeToSubscriptionPlanQueueURL!,
                        MessageBody: JSON.stringify(sqsRequest),
                        MessageDeduplicationId: id,
                        MessageGroupId: sqsRequest.botId.toString()
                    };
                    const sqs = new SQS({ region: process.env.region });
                    await sqs.sendMessage(messageParams).promise();
                } catch (error) {
                    console.log('Error:IncomingPaymentConfirmationHandler:SubscribeToSubscriptionPlanQueueURL: queue message', error);
                    throw error;
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
