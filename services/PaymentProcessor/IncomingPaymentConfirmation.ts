import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
//@ts-ignore
import { IRequestToConfirmPayment } from '/opt/PaymentTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

import { MessageSender } from '/opt/MessageSender';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { ISubscribeUserToSubscriptionPlan } from '/opt/UserSubscriptionTypes';
//@ts-ignore
import { MasterManager } from '/opt/MasterManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';

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

            //подтверждаем платеж в БД
            const updatePaymentResult = await PaymentOptionsManager.ConfirmPaymentRequest(request);
            console.log('PaymentOptionsManager.ConfirmPaymentRequest result', updatePaymentResult);

            if (updatePaymentResult === false) {
                //посылаем сообщение админу, что не удалось обновить платеж
                try {
                    await MessageSender.QueueSendPlainMessage({
                        discriminator: 'ITelegramMessage',
                        botId: Number(request.botId),
                        masterId: Number(request.masterId),
                        chatId: Number(request.masterId),
                        sendMethod: ETelegramSendMethod.sendMessage,
                        message: {
                            attachments: [],
                            text: 'Что-то пошло не так и платеж не был обработан'
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
                    if (endTrialChannel == 'EXPIRED') {
                        const msgIdAdmin = ksuid.randomSync(new Date()).string;
                        let text =
                            'Здравствуйте!\n' +
                            'Только что была подтверждена оплата последней подписки в рамках пробного лимита на канал. Это значит, что новые подписчики не смогут подписаться на ваш канал с помощью сервиса zuzona.\nДругих ограничений нет.\nЧтобы продолжить принимать оплаты, оплатите платную PRO-подписку на канал на сайте.\nС уважением, поддержка сервиса';
                        await MessageSender.QueueSendPlainMessage({
                            discriminator: 'ITelegramMessage',
                            botId: paymentDetails.botId,
                            masterId: paymentDetails.masterId,
                            chatId: paymentDetails.masterId,
                            sendMethod: ETelegramSendMethod.sendMessage,
                            message: {
                                attachments: [],
                                text: text
                            }
                        });
                    }
                }

                if (paymentDetails.subscriptionType === 'BOT') {
                    const endTrialChannel = await MasterManager.IncrementConnectedPaidBotUsers(Number(request.masterId));
                    if (endTrialChannel == 'EXPIRED') {
                        const msgIdAdmin = ksuid.randomSync(new Date()).string;
                        let text =
                            'Здравствуйте!\n' +
                            'Только что была подтверждена оплата последней подписки в рамках пробного лимита на бота. Это значит, что новые подписчики не смогут подписаться на ваш канал с помощью сервиса zuzona.\nДругих ограничений нет.\nЧтобы продолжить принимать оплаты, оплатите платную PRO-подписку на канал на сайте.\nС уважением, поддержка сервиса';
                        await MessageSender.QueueSendPlainMessage({
                            discriminator: 'ITelegramMessage',
                            botId: paymentDetails.botId,
                            masterId: paymentDetails.masterId,
                            chatId: paymentDetails.masterId,
                            sendMethod: ETelegramSendMethod.sendMessage,
                            message: {
                                attachments: [],
                                text: text
                            }
                        });
                    }
                }
                // отправляем в очередь на создание подписок
                try {
                    const sqsRequest: ISubscribeUserToSubscriptionPlan = {
                        id: request.id,
                        type: paymentDetails.subscriptionType,
                        botId: updatePaymentResult.botId,
                        chatId: updatePaymentResult.chatId,
                        masterId: updatePaymentResult.masterId,
                        userSubscriptionPlanId: updatePaymentResult.subscriptionPlanId,
                        pricePaid: updatePaymentResult.price,
                        currency: updatePaymentResult.currency,
                        paymentId: updatePaymentResult.id
                    };

                    await SQSHelper.SendSQSMessage({
                        QueueUrl: process.env.SubscribeToSubscriptionPlanQueueURL!,
                        message: sqsRequest,
                        messageGroupId: sqsRequest.botId.toString()
                    });
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
