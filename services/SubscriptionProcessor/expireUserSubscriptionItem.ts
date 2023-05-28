import { SQSEvent } from 'aws-lambda';
import { BanChannelMember } from './helpers/expireChannelInTG';
import { IChannelSubscriptionInDB, IBotSubscriptionInDB } from '/opt/UserSubscriptionTypes';
import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';
import { UserSubscriptionPlanBot } from '/opt/UserSubscriptionPlanBot';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            console.log('record', record);
            const request = JSON.parse(record.body);
            if (request.channelId != undefined) {
                const data = request as IChannelSubscriptionInDB;
                //channel
                const banResult = await BanChannelMember({
                    chatId: data.chatId,
                    channelId: data.channelId
                });
                if (banResult == false) {
                    throw 'Error:cant connect to telegram';
                }
                await UserSubscriptionPlanChannel.ExpireUserChannelSubscription({
                    masterId: data.masterId,
                    botId: data.botId,
                    channelId: data.channelId,
                    chatId: data.chatId,
                    id: data.id
                });
            } else {
                const data = request as IBotSubscriptionInDB;
                //channel

                await UserSubscriptionPlanBot.ExpireUserBotSubscription({
                    masterId: data.masterId,
                    botId: data.botId,
                    chatId: data.chatId,
                    id: data.id
                });
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
