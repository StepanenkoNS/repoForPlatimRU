import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
//@ts-ignore
import { IRequestForPaymentConfirmation, IRequestToConfirmPayment } from '/opt/PaymentTypes';
//@ts-ignore
import PaymentOptionsManager from '/opt/PaymentOptionsManager';
//@ts-ignore
import MessageSender from '/opt/MessageSender';
//@ts-ignore
import { UserBotProfile } from '/opt/MessagingBotUserBotProfile';
import { IUserBotProfile } from '/opt/MessagingBotTypes';

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
                    BOTUUID: request.BOTUUID,
                    masterId: request.masterId,
                    recipientChatId: request.masterId,
                    text: 'Этот платеж был подтвержден ранее'
                });
            } else {
                const result = await UserBotProfile.SubscribeToContentPlanStatic({
                    botId: updatePaymentResult.botId,
                    BOTUUID: updatePaymentResult.BOTUUID,
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
                    const sendResultAdmin = await MessageSender.SendTextMessage({
                        BOTUUID: updatePaymentResult.BOTUUID,
                        masterId: updatePaymentResult.masterId,
                        recipientChatId: updatePaymentResult.masterId,
                        text: adminText
                    });
                    const sendResultUser = await MessageSender.SendTextMessage({
                        BOTUUID: updatePaymentResult.BOTUUID,
                        masterId: updatePaymentResult.masterId,
                        recipientChatId: updatePaymentResult.chatId,
                        text: userText
                    });
                } else {
                    //шлем сообщение админу, что операция провалилась
                    const sendResultAdmin = await MessageSender.SendTextMessage({
                        BOTUUID: updatePaymentResult.BOTUUID,
                        masterId: updatePaymentResult.masterId,
                        recipientChatId: updatePaymentResult.masterId,
                        text: 'Платеж был успешно подтвержден, но подписки добавить не удалось. Свяжитесь с технической поддержкой'
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
