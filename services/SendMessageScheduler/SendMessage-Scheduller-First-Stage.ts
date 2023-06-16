import { TextHelper } from 'opt/TextHelpers/textHelper';
import { MessagingBotSubscriptionManager } from 'opt/MessagingBotSubscriptionManager';
import { ClusterCount } from 'tgbot-project-types/TypesCompiled/GeneralTypes';

export async function handler(): Promise<any> {
    const max = ClusterCount;
    for (let i = 0; i < max; i++) {
        await MessagingBotSubscriptionManager.SchedullerFirstStage(i);
    }
}
