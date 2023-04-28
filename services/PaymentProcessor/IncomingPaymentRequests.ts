import { SQSEvent } from 'aws-lambda';
import { SQS } from 'aws-sdk';

//@ts-ignore
import { EPaymentType, IRequestForPaymentConfirmation, IRequestForSubscriptionDIRECTPayment } from '/opt/PaymentTypes';

import { PaymentOptionsManager } from '/opt/PaymentOptionsManager';

import { MessageSender } from '/opt/MessageSender';
import { ETelegramUserStatus } from '/opt/MessagingBotManagerTypes';

const sqs = new SQS({ region: process.env.region });

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingPaymentRequestsHandler - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const request = JSON.parse(record.body) as IRequestForPaymentConfirmation;
            const dataItem: IRequestForSubscriptionDIRECTPayment = {
                discriminator: 'IRequestForSubscriptionDIRECTPayment',
                id: undefined,
                chatId: Number(request.chatId),
                masterId: Number(request.masterId),
                botId: Number(request.botId),

                subscriptionPlanId: request.subscriptionPlanId,
                subscriptionPlanName: request.subscriptionPlanName,
                subscriptionType: request.subscriptionType,
                price: request.price,
                currency: request.currency,
                paymentOptionId: request.paymentOptionId,
                paymentOptionType: EPaymentType.DIRECT,
                status: 'NEW',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            const addPaymentEventResult = await PaymentOptionsManager.AddDIRECTPaymentRequest(dataItem);

            if (addPaymentEventResult === false) {
                batchItemFailures.push({ itemIdentifier: record.messageId });
            } else {
                //отправляем сообщение
                const itemMessage: IRequestForPaymentConfirmation = {
                    discriminator: 'IRequestForPaymentConfirmation',
                    id: addPaymentEventResult.id,
                    chatId: Number(request.chatId),
                    masterId: Number(request.masterId),
                    botId: Number(request.botId),

                    subscriptionPlanId: request.subscriptionPlanId,
                    subscriptionPlanName: request.subscriptionPlanName,
                    subscriptionType: request.subscriptionType,
                    price: request.price,
                    currency: request.currency,
                    paymentOptionId: request.paymentOptionId,
                    paymentOptionType: request.paymentOptionType,

                    status: addPaymentEventResult.status!,
                    createdAt: addPaymentEventResult.createdAt,
                    updatedAt: addPaymentEventResult.updatedAt,
                    telegramMessageText: request.telegramMessageText,
                    telegramFileId: request.telegramFileId,
                    telegramSendMethod: request.telegramSendMethod
                };

                const sendResult = await MessageSender.SendPaymentMethodToAdmin(itemMessage);
                if (sendResult === false) {
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
                if (sendResult === ETelegramUserStatus.THROTTLED) {
                    console.log('request throttled by telegram');
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
                if (sendResult === ETelegramUserStatus.ERROR) {
                    console.log('Unknown error');
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
            }

            console.log(record);
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
