import { TextHelper } from 'opt/TextHelpers/textHelper';

import { SQSEvent } from 'aws-lambda';

//@ts-ignore
import {
    EPaymentOptionType,
    EPaymentTarget,
    IDigitalStorePaymentInDB,
    IMeetingPaymentInDB,
    IRequestForPaymentConfirmation,
    ISubscriptionPaymentInDB
} from 'tgbot-project-types/TypesCompiled/PaymentTypes';

import { PaymentOptionsManager } from 'opt/PaymentOptionsManager';

import { MessageSender } from 'opt/MessageSender';
import { ETelegramUserStatus } from 'tgbot-project-types/TypesCompiled/TelegramTypesPrimitive';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingPaymentRequestsHandler - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            let addPaymentEventResult: any | undefined = undefined;
            let ConfirmationMessageText = '';
            const parsedInputData = JSON.parse(record.body) as IRequestForPaymentConfirmation;
            if (parsedInputData.paymentTarget === EPaymentTarget.SUBSCRIPTION) {
                const request = parsedInputData as unknown as ISubscriptionPaymentInDB;
                const dataItem: ISubscriptionPaymentInDB = {
                    id: undefined,
                    chatId: Number(request.chatId),
                    masterId: Number(request.masterId),
                    botId: Number(request.botId),
                    paymentTarget: request.paymentTarget,
                    subscriptionPlanId: request.subscriptionPlanId,
                    subscriptionPlanName: request.subscriptionPlanName,
                    subscriptionType: request.subscriptionType,
                    channelId: request.channelId ? request.channelId : undefined,
                    price: request.price,
                    currency: request.currency,
                    paymentOptionId: request.paymentOptionId,
                    paymentOptionType: EPaymentOptionType.DIRECT,
                    status: 'NEW',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const tmpPaymentResult = await PaymentOptionsManager.AddPaymentRequest_DIRECT(dataItem);
                if (tmpPaymentResult.success === false || !tmpPaymentResult.data) {
                    throw 'AddDIRECTPaymentRequest.success === false';
                }

                addPaymentEventResult = tmpPaymentResult.data;
                ConfirmationMessageText =
                    'Запрос на подписку ' +
                    dataItem.subscriptionType +
                    '\nОплачено: ' +
                    dataItem.price +
                    ' ' +
                    dataItem.currency.toString() +
                    '\nИмя подписки: ' +
                    dataItem.subscriptionPlanName +
                    '\nid подписчика: ' +
                    dataItem.chatId;
            }

            if (parsedInputData.paymentTarget === EPaymentTarget.DIGITALSTORE) {
                const request = parsedInputData as unknown as IDigitalStorePaymentInDB;
                const dataItem: IDigitalStorePaymentInDB = {
                    id: undefined,
                    chatId: Number(request.chatId),
                    masterId: Number(request.masterId),
                    botId: Number(request.botId),
                    paymentTarget: request.paymentTarget,

                    digitalStoreCategoryId: request.digitalStoreCategoryId,
                    digitalStoreItemId: request.digitalStoreItemId,
                    itemNameForUser: request.itemNameForUser,
                    categoryNameForUser: request.categoryNameForUser,

                    price: request.price,
                    currency: request.currency,
                    paymentOptionId: request.paymentOptionId,
                    paymentOptionType: EPaymentOptionType.DIRECT,

                    status: 'NEW',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const tmpPaymentResult = await PaymentOptionsManager.AddPaymentRequest_DIRECT(dataItem);

                if (tmpPaymentResult.success === false || !tmpPaymentResult.data) {
                    throw 'AddDIRECTPaymentRequest.success === false';
                }

                addPaymentEventResult = tmpPaymentResult.data;

                ConfirmationMessageText = 'Запрос на оплату товара в цифровом магазине ' + '\nОплачено: ' + dataItem.price + ' ' + dataItem.currency.toString() + '\nid подписчика: ' + dataItem.chatId;
            }

            if (parsedInputData.paymentTarget === EPaymentTarget.TICKET) {
                const request = parsedInputData as unknown as IMeetingPaymentInDB;
                const dataItem: IMeetingPaymentInDB = {
                    id: undefined,
                    chatId: Number(request.chatId),
                    masterId: Number(request.masterId),
                    botId: Number(request.botId),
                    paymentTarget: request.paymentTarget,
                    calendarMeetingId: request.calendarMeetingId,

                    itemNameForUser: request.itemNameForUser,

                    price: request.price,
                    currency: request.currency,
                    paymentOptionId: request.paymentOptionId,
                    paymentOptionType: EPaymentOptionType.DIRECT,

                    status: 'NEW',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                const tmpPaymentResult = await PaymentOptionsManager.AddPaymentRequest_DIRECT(dataItem);

                if (tmpPaymentResult.success === false || !tmpPaymentResult.data) {
                    throw 'AddDIRECTPaymentRequest.success === false';
                }

                addPaymentEventResult = tmpPaymentResult.data;

                ConfirmationMessageText = 'Запрос на оплату товара в цифровом магазине ' + '\nОплачено: ' + dataItem.price + ' ' + dataItem.currency.toString() + '\nid подписчика: ' + dataItem.chatId;
            }

            if (addPaymentEventResult === undefined) {
                throw 'addPaymentEventResult === undefined';
            } else {
                //отправляем сообщение
                const itemMessage: IRequestForPaymentConfirmation = {
                    id: addPaymentEventResult.id,
                    chatId: Number(parsedInputData.chatId),
                    masterId: Number(parsedInputData.masterId),
                    botId: Number(parsedInputData.botId),
                    confirmationMessageText: ConfirmationMessageText,
                    paymentTarget: parsedInputData.paymentTarget,

                    price: parsedInputData.price,
                    currency: parsedInputData.currency,
                    paymentOptionId: parsedInputData.paymentOptionId,
                    paymentOptionType: parsedInputData.paymentOptionType,

                    status: addPaymentEventResult.status!,
                    createdAt: addPaymentEventResult.createdAt,
                    updatedAt: addPaymentEventResult.updatedAt,
                    telegramMessageText: parsedInputData.telegramMessageText,
                    telegramFileId: parsedInputData.telegramFileId,
                    telegramSendMethod: parsedInputData.telegramSendMethod,
                    telegramMessageId: null
                };

                const sendResult = await MessageSender.SendPaymentMethodToAdmin(itemMessage);
                if (sendResult.success === false || !sendResult.data) {
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
                if (sendResult.data!.status === ETelegramUserStatus.THROTTLED) {
                    console.log('request throttled by telegram');
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
                if (sendResult.data!.status === ETelegramUserStatus.ERROR) {
                    console.log('Unknown error');
                    batchItemFailures.push({ itemIdentifier: record.messageId });
                }
            }

            //console.log(record);
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
