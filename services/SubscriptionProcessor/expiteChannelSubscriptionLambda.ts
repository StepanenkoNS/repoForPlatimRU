import { TextHelper } from '/opt/TextHelpers/textHelper';
//@ts-ignore
import { SQSHelper } from '/opt/SQS/SQSHelper';
import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';

export async function handler(event: any): Promise<any> {
    const data = await UserSubscriptionPlanChannel.ListChannelSubscriptionsToExpire();
    if (data.success == false || !data.data) {
        console.log('Error: data is empty');
    }
    console.log('data.length', data.data.length);

    //если он большой - то разбиваем еще на пакет кусков
    const promises = [];
    const batchLimit = 10;
    for (const item of data.data) {
        const message = { ...item, ...{ discriminator: 'IChannelSubscriptionInDB' } };
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
