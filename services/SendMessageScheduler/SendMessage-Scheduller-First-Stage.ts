import { TextHelper } from 'opt/TextHelpers/textHelper';
import { MessagingBotSubscriptionManager } from 'opt/MessagingBotSubscriptionManager';
import { ClusterCount } from 'opt/GeneralTypes';

export async function handler(): Promise<any> {
    const max = ClusterCount;
    for (let i = 0; i < max; i++) {
        await MessagingBotSubscriptionManager.SchedullerFirstStage(i);
    }
}
