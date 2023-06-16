import { TextHelper } from 'opt/TextHelpers/textHelper';
import { SQSEvent } from 'aws-lambda';

//@ts-ignore
import { MessagingBotSubscriptionManager } from 'opt/MessagingBotSubscriptionManager';

import { PostTrigger } from 'opt/ContentTypes';
import { IAddDeleteContentPlanFromSubscription } from 'opt/UserSubscriptionTypes';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log('IncomingEvent', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            //console.log('record', record);

            const request = JSON.parse(record.body) as IAddDeleteContentPlanFromSubscription;

            const data: IAddDeleteContentPlanFromSubscription = {
                masterId: request.masterId,
                botId: request.botId,
                botSubscriptionId: request.botSubscriptionId,
                contentPlanId: request.contentPlanId,
                action: request.action
            };

            let result = false;
            if (data.action == 'add') {
                result = await MessagingBotSubscriptionManager.Scheduleler_AddContentPlanToBotSubscription(data);
            }
            if (data.action == 'delete') {
                result = await MessagingBotSubscriptionManager.Scheduleler_DeleteContentPlanFromBotSubscription(data);
            }

            if (result === false) {
                console.log('Error in MessagingBotSubscriptionManager', data);
                batchItemFailures.push({ itemIdentifier: record.messageId });
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
