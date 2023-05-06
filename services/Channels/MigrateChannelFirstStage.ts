import { SQSEvent } from 'aws-lambda';

import { LoadChannelParticipants } from './helpers/loadChannelParticipants';
import { SQSHelper } from '/opt/SQS/SQSHelper';
import { MessageSender } from '/opt/MessageSender';
import { ETelegramSendMethod } from '/opt/TelegramTypes';
import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';
import { ESupportedCurrency } from '../../../TGBot-CoreLayers/LambdaLayers/Types/PaymentTypes';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            //console.log('record', record);

            const request = JSON.parse(record.body) as { masterId: number; botId: number; channelId: number; subscriptionLengthInDays: number };
            const participants = await LoadChannelParticipants({ channelId: request.channelId });

            if (participants == false) {
                await MessageSender.QueueSendPlainMessage({
                    botId: Number(process.env.botFatherId!),
                    chatId: request.masterId,
                    discriminator: 'ITelegramMessage',
                    masterId: request.masterId,
                    message: {
                        attachments: [],
                        text:
                            'Не удалось получить список пользователей вашего канала из Telegram, проверьте пожалуйста, что бот zuzona добавлен в канал с правами администратора\nЭто попытка ' +
                            record.attributes.ApproximateReceiveCount +
                            ' из 3. Следующая попытка будет через 15 минут'
                    },
                    sendMethod: ETelegramSendMethod.sendMessage
                });
                throw 'Error: participants == false\n' + JSON.stringify(request, null, 4);
            }

            //создаем миграционный план, в который будут добавлены пользователи
            const addPlanResult = await UserSubscriptionPlanChannel.AddUserSubscriptionPlanChannel({
                channelId: request.channelId,
                botId: request.botId,
                discriminator: 'IUserSubscriptionPlanChannel',
                enabled: false,
                lengthInDays: request.subscriptionLengthInDays,
                masterId: request.masterId,
                name: 'MIGRATION',
                prices: [{ price: 0, currency: ESupportedCurrency.USD }]
            });
            if (addPlanResult == false) {
                await MessageSender.QueueSendPlainMessage({
                    botId: Number(process.env.botFatherId!),
                    chatId: request.masterId,
                    discriminator: 'ITelegramMessage',
                    masterId: request.masterId,
                    message: {
                        attachments: [],
                        text: 'Мы не смогли создать миграционный план для переноса пользователей' + record.attributes.ApproximateReceiveCount + ' из 3. Следующая попытка будет через 15 минут'
                    },
                    sendMethod: ETelegramSendMethod.sendMessage
                });
                throw 'Error: AddUserSubscriptionPlanChannel == false\n' + JSON.stringify(request, null, 4);
            }

            const arrayToSend = participants.map((participant) => {
                return {
                    masterId: request.masterId,
                    botId: request.botId,
                    channelId: request.channelId,
                    chatId: participant.id,
                    userName: participant.userName,
                    subscriptionPlanId: addPlanResult.id!
                };
            });
            await MessageSender.QueueSendPlainMessage({
                botId: Number(process.env.botFatherId!),
                chatId: request.masterId,
                discriminator: 'ITelegramMessage',
                masterId: request.masterId,
                message: {
                    attachments: [],
                    text: 'Мы начали импорт подписчиков из вашего канала. Всего будет импортировано ' + arrayToSend.length + ' записей'
                },
                sendMethod: ETelegramSendMethod.sendMessage
            });

            await SQSHelper.SendSQSMessageSmallBatch({
                messages: arrayToSend,
                messageGroupId: 'CHANNELID#' + request.channelId.toString(),
                QueueUrl: process.env.migrateChannelSecondQueueURL!
            });

            await MessageSender.QueueSendPlainMessage({
                botId: Number(process.env.botFatherId!),
                chatId: request.masterId,
                discriminator: 'ITelegramMessage',
                masterId: request.masterId,
                message: {
                    attachments: [],
                    text: 'Импорт успешно завершен. Пользователи отобразятся в системе в течении 15 минут'
                },
                sendMethod: ETelegramSendMethod.sendMessage
            });
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
