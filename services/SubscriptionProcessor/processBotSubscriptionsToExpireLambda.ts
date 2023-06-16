import { TextHelper } from 'opt/TextHelpers/textHelper'; //@ts-ignore
import { UserSubscriptionPlanBot } from 'opt/UserSubscriptionPlanBot';
import { SQSHelper } from 'opt/SQS/SQSHelper';

export async function handler(event: any): Promise<any> {
    await UserSubscriptionPlanBot.ProcessSubscriptionsToExpire();
}
