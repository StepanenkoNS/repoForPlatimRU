import { SQSEvent } from 'aws-lambda';
import { ECascadeDeleteTarget, ICascadeDelete } from '/opt/GeneralTypes';

//@ts-ignore
import { CascadeDeleteProcessor } from '/opt/CascadeDeleteProcessor';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log(event);
    for (const record of event.Records) {
        try {
            console.log('record', record);
            const request = JSON.parse(record.body) as ICascadeDelete;
            console.log(request);
            switch (request.target) {
                case ECascadeDeleteTarget.IContentPlanPost: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteContentPlanPost(params);
                    break;
                }
                case ECascadeDeleteTarget.IContentPlan: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteContentPlan(params);
                    break;
                }
                case ECascadeDeleteTarget.ITelegramChannel: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteTelegramChannel(params);
                    break;
                }
                case ECascadeDeleteTarget.IUserSubscriptionPlanChannel: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteUserSubsriptionPlanChannel(params);
                    break;
                }
                case ECascadeDeleteTarget.IUserSubscriptionPlanBot: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteUserSubscriptionPlanBot(params);
                    break;
                }
                case ECascadeDeleteTarget.IDigitalStoreItem: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteUserDigitalStoreItem(params);
                    break;
                }
                case ECascadeDeleteTarget.IDigitalStoreCategory: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteUserDigitalStoreCategory(params);
                    break;
                }
                case ECascadeDeleteTarget.IMessagingBot: {
                    const params = { ...(request.keys as any), ...{ botId: request.botId, masterId: request.masterId } };
                    CascadeDeleteProcessor.DeleteBot(params);
                    break;
                }
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
