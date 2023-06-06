import { TextHelper } from '/opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
//@ts-ignore
import { EPaymentTarget, IDigitalStorePaymentInDB, IMeetingPaymentInDB, IPaidPostPaymentInDB, IRequestToConfirmPayment, ISubscriptionPaymentInDB } from '/opt/PaymentTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

import { MessageSender } from '/opt/MessageSender';

import { ETelegramSendMethod } from '/opt/TelegramTypes';

import { ISubscribeUserToSubscriptionPlan } from '/opt/UserSubscriptionTypes';
//@ts-ignore
import { MasterManager } from '/opt/MasterManager';
import { SQSHelper } from '/opt/SQS/SQSHelper';
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';
import { DigitalStoreManager } from '/opt/DigitalStoreManager';
import { CalendarMeetingsConfiguratior } from '/opt/CalendarMeetingsConfiguratior';
import { ContentConfigurator } from '/opt/ContentConfigurator';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingPaymentConfirmation - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);

            const request = JSON.parse(record.body) as IRequestToConfirmPayment;

            //подтверждаем платеж в БД
            const updatedPayment = await PaymentOptionsManager.ConfirmPaymentRequest(request);
            //console.log('PaymentOptionsManager.ConfirmPaymentRequest result', updatePaymentResult);

            if (updatedPayment.success === false || !updatedPayment.data) {
                //посылаем сообщение админу, что не удалось обновить платеж
                try {
                    await MessageSender.QueueSendPlainMessage({
                        botId: Number(request.botId),
                        masterId: Number(request.masterId),
                        chatId: Number(request.masterId),

                        message: {
                            attachments: [],
                            text: 'Что-то пошло не так и платеж не был обработан',
                            sendMethod: ETelegramSendMethod.sendMessage
                        }
                    });
                } catch (error) {
                    console.log('Error:IncomingPaymentConfirmationHandler:MessageSender.QueueSendGenericMessage', error);
                    throw error;
                }
            } else {
                //обрабатываем результаты платеж

                const updatedPaymentData = updatedPayment.data!;
                if (updatedPaymentData.status == 'CONFIRMED') {
                    if (updatedPaymentData.paymentTarget === EPaymentTarget.SUBSCRIPTION) {
                        // обновляем количество триальных подписчиков
                        const details = updatedPaymentData as ISubscriptionPaymentInDB;

                        //подписываем на подписки - если  target = subscription
                        try {
                            const sqsRequest: ISubscribeUserToSubscriptionPlan = {
                                id: request.id,
                                type: details.subscriptionType,
                                botId: details.botId,
                                chatId: details.chatId,
                                masterId: details.masterId,
                                channelId: details.channelId ? details.channelId : undefined,
                                userSubscriptionPlanId: details.subscriptionPlanId,
                                pricePaid: details.price,
                                currency: details.currency,
                                paymentId: details.id!
                            };
                            console.log('sending SQS', sqsRequest);
                            await SQSHelper.SendSQSMessage({
                                QueueUrl: process.env.SubscribeToSubscriptionPlanQueueURL!,
                                message: sqsRequest
                            });
                        } catch (error) {
                            console.log('Error:IncomingPaymentConfirmationHandler:SubscribeToSubscriptionPlanQueueURL: queue message', error);
                            throw error;
                        }
                    }

                    if (updatedPaymentData.paymentTarget === EPaymentTarget.DIGITALSTORE) {
                        const details = updatedPaymentData as IDigitalStorePaymentInDB;

                        try {
                            const result = await DigitalStoreManager.AddDigitalStoreItemToUser({
                                masterId: details.masterId,
                                botId: details.botId,
                                chatId: details.chatId,
                                pricePaid: { price: details.price, currency: details.currency },
                                digitalStoreCategoryId: details.digitalStoreCategoryId,
                                digitalStoreItemId: details.digitalStoreItemId
                            });

                            if (result.success == false || !result.data) {
                                throw 'cant add digital store item to user';
                            }

                            //посылаем сообщение пользователю, что все зоебись
                            try {
                                await MessageSender.QueueSendPlainMessage({
                                    botId: Number(request.botId),
                                    masterId: Number(request.masterId),
                                    chatId: details.chatId,

                                    message: {
                                        attachments: [],
                                        text: 'Товар успешно добавлен в вашу библиотеку',
                                        sendMethod: ETelegramSendMethod.sendMessage
                                    }
                                });
                            } catch (error) {
                                console.log('Error:IncomingPaymentConfirmationHandler:MessageSender.QueueSendGenericMessage', error);
                                throw error;
                            }
                        } catch (error) {
                            console.log('Error:IncomingPaymentConfirmationHandler:SubscribeToSubscriptionPlanQueueURL: queue message', error);
                            throw error;
                        }
                    }
                    if (updatedPaymentData.paymentTarget === EPaymentTarget.TICKET) {
                        const details = updatedPaymentData as IMeetingPaymentInDB;

                        try {
                            const result = await CalendarMeetingsConfiguratior.AddMeetingParticipant({
                                masterId: details.masterId,
                                botId: details.botId,
                                calendarMeetingId: details.calendarMeetingId,
                                chatId: details.chatId,
                                pricePaid: { price: details.price, currency: details.currency }
                            });

                            if (result.success == false || !result.data) {
                                throw 'cant add digital store item to user';
                            }
                        } catch (error) {
                            console.log('Error:IncomingPaymentConfirmationHandler:SubscribeToSubscriptionPlanQueueURL: queue message', error);
                            throw error;
                        }
                    }
                } else {
                    console.log('payment status not confirmed', updatedPaymentData.status);
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
