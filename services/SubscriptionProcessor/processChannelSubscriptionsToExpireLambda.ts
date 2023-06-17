import { TextHelper } from '/opt/TextHelpers/textHelper';
//@ts-ignore
import { SQSHelper } from '/opt/SQS/SQSHelper';
import { UserSubscriptionPlanChannel } from '/opt/UserSubscriptionPlanChannel';

export async function handler(event: any): Promise<any> {
    await UserSubscriptionPlanChannel.ProcessSubscriptionsToExpire();
}
