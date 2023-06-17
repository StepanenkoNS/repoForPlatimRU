import { SQSEvent } from 'aws-lambda';
import { ECascadeDeleteTarget, ICascadeDelete } from 'tgbot-project-types/TypesCompiled/GeneralTypes';

//@ts-ignore
import { CascadeDeleteProcessor } from '/opt/CascadeDeleteProcessor';

export async function handler(event: SQSEvent): Promise<any> {
    const batchItemFailures: any[] = [];
    console.log(event);
    for (const record of event.Records) {
        try {
            const request = JSON.parse(record.body) as ICascadeDelete;
            //console.log(request);

            const paramKeys = { ...(request.keys as any) };

            switch (request.target) {
                case ECascadeDeleteTarget.IContentPlanPost: {
                    await CascadeDeleteProcessor.DeleteContentPlanPost(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IContentPlan: {
                    await CascadeDeleteProcessor.DeleteContentPlan(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.ITelegramChannel: {
                    await CascadeDeleteProcessor.DeleteTelegramChannel(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IUserSubscriptionPlanChannel: {
                    await CascadeDeleteProcessor.DeleteUserSubsriptionPlanChannel(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IUserSubscriptionPlanBot: {
                    await CascadeDeleteProcessor.DeleteUserSubscriptionPlanBot(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IDigitalStoreItem: {
                    await CascadeDeleteProcessor.DeleteUserDigitalStoreItem(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IDigitalStoreCategory: {
                    await CascadeDeleteProcessor.DeleteUserDigitalStoreCategory(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IDigitalStoreCategory_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_DigitalStoreCategories(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IContentPlan_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_ContentPlans(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.ITelegramFile_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_TelegramFiles(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IPaymentOption_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_PaymentOptions(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.ITelegramChannel_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_Channels(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IUserSubscriptionPlanBot_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_BotSubscriptionPlans(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IUserSubscriptionPlanChannel_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_ChannelSubscriptionPlans(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.ICalendarMeeting_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_CalendarMeetings(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IBotAnalytics_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_Analytics(paramKeys);
                    break;
                }

                case ECascadeDeleteTarget.IUserBotProfile_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_Users(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IPaymentInDB_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_Payments(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IPostRates: {
                    await CascadeDeleteProcessor.DeleteContentPlanPostRates(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IPostFeedBacks: {
                    await CascadeDeleteProcessor.DeleteContentPlanPostFeedbacks(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IScheduledPosts: {
                    await CascadeDeleteProcessor.DeleteContentPlanPostSchedules(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IPaymentInDB_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_Payments(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.IFeedBack_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_FeedBacks(paramKeys);
                    break;
                }
                case ECascadeDeleteTarget.INotification_ALL: {
                    await CascadeDeleteProcessor.Delete_ALL_Notifications(paramKeys);
                    break;
                }

                case ECascadeDeleteTarget.IMessagingBot: {
                    await CascadeDeleteProcessor.DeleteBot(paramKeys);
                    break;
                }

                // //

                // await this.DeleteBot_Lists(ECascadeDeleteTarget.IPaymentInDB_ALL, key);
            }
        } catch (error) {
            console.log('Error in processing SQS consumer: ${record.body}', error);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    console.log('batchItemFailures', batchItemFailures);
    return { batchItemFailures };
}
