import { TextHelper } from '/opt/TextHelpers/textHelper'; //@ts-ignore
import { UserSubscriptionPlanBot } from '/opt/UserSubscriptionPlanBot';
import { SQSHelper } from '/opt/SQS/SQSHelper';

export async function handler(event: any): Promise<any> {
    const data = await UserSubscriptionPlanBot.ListBotSubscriptionsToExpire();
    console.log('data.length', data.length);
    //если он большой - то разбиваем еще на пакет кусков
    const promises = [];
    const batchLimit = 10;
    for (const item of data) {
        const message = { ...item, ...{ discriminator: 'IBotSubscriptionInDB' } };
        const promise = SQSHelper.SendSQSMessage({
            message: message,
            QueueUrl: process.env.expireSubscriptionQueueURL!,
            messageGroupId: 'BOTID#' + item.botId.toString()
        });
        promises.push(promise);
        if (promises.length > batchLimit) {
            await Promise.all(promises);
        }
    }
    await Promise.all(promises);
}
