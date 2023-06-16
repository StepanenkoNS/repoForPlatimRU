import { SQSEvent } from 'aws-lambda';

import { UserSubscriptionPlanChannel } from 'opt/UserSubscriptionPlanChannel';
import { UserSubscriptionPlanBot } from 'opt/UserSubscriptionPlanBot';
import { ITelegramBotCleaupRequest, ITelegramChannelCleaupRequest } from 'tgbot-project-types/TypesCompiled/TelegramTypes';
import { TelegramClient } from 'telegram';
import { PomponaProcessor } from 'opt/PomponaProcessor';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log(event);

    const data: {
        messageId: string;
        item: ITelegramChannelCleaupRequest | ITelegramBotCleaupRequest;
    }[] = [];

    event.Records.forEach((record) => {
        try {
            const request = JSON.parse(record.body);
            if (request.channelId != undefined) {
                data.push({ messageId: record.messageId, item: request as ITelegramChannelCleaupRequest });
            } else {
                data.push({ messageId: record.messageId, item: request as ITelegramBotCleaupRequest });
            }
        } catch (error) {
            console.log('Error in processing JSON - SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    });

    data.sort((a, b) => {
        if (a.item.masterId === b.item.masterId) {
            return a.item.botId > b.item.botId ? 1 : -1;
        } else {
            return a.item.botId > b.item.botId ? 1 : -1;
        }
    });

    //подписки на бота
    data.filter((value) => {
        return (value.item as ITelegramChannelCleaupRequest).channelId !== undefined;
    }).forEach(async (value, index) => {
        try {
            const result = await UserSubscriptionPlanBot.ExpireUserBotSubscription({
                masterId: value.item.masterId,
                botId: value.item.botId,
                chatId: value.item.chatId,
                id: value.item.id
            });
            if (result == false) {
                console.log('Error in processing SQS consumer: ${record.body} - batch result is false');
                batchItemFailures.push({ itemIdentifier: value.messageId });
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: value.messageId });
        }
    });

    const filteredChannels = data.filter((value) => {
        return (value.item as ITelegramChannelCleaupRequest).channelId == undefined;
    });

    if (filteredChannels.length > 0) {
        const tempItem = {
            masterId: filteredChannels[0].item.masterId,
            botId: filteredChannels[0].item.botId
        };
        let client: TelegramClient | undefined = await PomponaProcessor.GetClient(tempItem.masterId, tempItem.botId);

        filteredChannels.forEach(async (value, index) => {
            const item = value.item as ITelegramChannelCleaupRequest;
            const result = await UserSubscriptionPlanChannel.ProcessFailed_ExpireChannelSubscription(client, {
                masterId: item.masterId,
                botId: item.botId,
                chatId: item.chatId,
                id: item.id,
                channelId: item.channelId
            });
            if (result == false) {
                console.log('Error in processing SQS consumer: ${record.body} - batch result is false');
                batchItemFailures.push({ itemIdentifier: value.messageId });
            }
        });
    }
    //подписки на канал

    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
