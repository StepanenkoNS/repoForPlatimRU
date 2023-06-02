import { TextHelper } from '/opt/TextHelpers/textHelper';
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';
import { ClusterCount } from '/opt/GeneralTypes';

export async function handler(): Promise<any> {
    for (let i = 0; i < ClusterCount; i++) {
        await MessagingBotSubscriptionManager.SchedullerFirstStage(i);
    }
}
