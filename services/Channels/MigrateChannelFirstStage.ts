import { SQSEvent } from 'aws-lambda';

import { LoadChannelParticipants } from './helpers/loadChannelParticipants';
import { SQSHelper } from '/opt/SQS/SQSHelper';
import { MessageSender } from '/opt/MessageSender';
import { ETelegramSendMethod } from '/opt/TelegramTypes';
import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';
import { ESupportedCurrency } from '/opt/PaymentTypes';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            //console.log('record', record);

            const request = JSON.parse(record.body) as { masterId: number; botId: number; channelId: number; subscriptionLengthInDays: number };

            const participants = await LoadChannelParticipants({ channelId: request.channelId, masterId: request.masterId, botId: request.botId });

            if (participants.success == false || !participants.data) {
                let text =
                    'В процессе миграции пользователей не удалось получить список пользователей вашего канала из Telegram, проверьте пожалуйста, что бот pompona добавлен в канал с правами администратора.\n';
                if (record.attributes.ApproximateReceiveCount == '3') {
                    text = text + 'Это последняя попытка 3-я попытка';
                } else {
                    text = text + 'Это попытка ' + record.attributes.ApproximateReceiveCount + ' из 3. Следующая попытка будет через 15 минут';
                }
                await MessageSender.QueueSendPlainMessage({
                    botId: request.botId,
                    chatId: request.masterId,

                    masterId: request.masterId,
                    message: {
                        attachments: [],
                        text: text,
                        sendMethod: ETelegramSendMethod.sendMessage
                    }
                });
                throw 'Error: participants == false\n' + JSON.stringify(request, null, 4);
            }

            //создаем миграционный план, в который будут добавлены пользователи
            const addPlanResult = await UserSubscriptionPlanChannel.AddUserSubscriptionPlanChannel({
                channelId: request.channelId,
                botId: request.botId,

                enabled: false,
                lengthInDays: request.subscriptionLengthInDays,
                masterId: request.masterId,
                name: 'MIGRATION',
                prices: [{ price: 0, currency: ESupportedCurrency.USD }],
                lifeTime: false
            });
            if (addPlanResult.success == false || !addPlanResult.data) {
                let text = 'В процессе миграции пользователей произошла ошибка - мы не смогли создать миграционный план для переноса пользователейю. \n';
                if (record.attributes.ApproximateReceiveCount == '3') {
                    text = text + 'Это последняя попытка 3-я попытка';
                } else {
                    text = text + 'Это попытка ' + record.attributes.ApproximateReceiveCount + ' из 3. Следующая попытка будет через 15 минут';
                }
                await MessageSender.QueueSendPlainMessage({
                    botId: request.botId,
                    chatId: request.masterId,

                    masterId: request.masterId,
                    message: {
                        attachments: [],
                        text: text,
                        sendMethod: ETelegramSendMethod.sendMessage
                    }
                });
                throw 'Error: AddUserSubscriptionPlanChannel == false\n' + JSON.stringify(request, null, 4);
            }

            const arrayToSend = participants.data.map((participant) => {
                return {
                    masterId: request.masterId,
                    botId: request.botId,
                    channelId: request.channelId,
                    chatId: participant.id,
                    userName: participant.userName,
                    subscriptionPlanId: addPlanResult.data!.id!
                };
            });
            await MessageSender.QueueSendPlainMessage({
                botId: Number(process.env.botFatherId!),
                chatId: request.masterId,

                masterId: request.masterId,
                message: {
                    attachments: [],
                    text: 'Мы начали импорт подписчиков из вашего канала в систему Pompona. Всего будет импортировано ' + arrayToSend.length + ' записей',
                    sendMethod: ETelegramSendMethod.sendMessage
                }
            });

            await SQSHelper.SendSQSMessageSmallBatch({
                messages: arrayToSend,
                messageGroupId: 'CHANNELID#' + request.channelId.toString(),
                QueueUrl: process.env.migrateChannelSecondQueueURL!
            });

            await MessageSender.QueueSendPlainMessage({
                botId: Number(process.env.botFatherId!),
                chatId: request.masterId,

                masterId: request.masterId,
                message: {
                    attachments: [],
                    text: 'Импорт успешно завершен. Пользователи отобразятся в системе в течении 5 минут',
                    sendMethod: ETelegramSendMethod.sendMessage
                }
            });
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
