import { TextHelper } from '/opt/TextHelpers/textHelper';
import { MessagingBotSubscriptionManager } from '/opt/MessagingBotSubscriptionManager';
import { ClusterCount_SendMessage } from 'tgbot-project-types/TypesCompiled/GeneralTypes';

export async function handler(): Promise<any> {
    const max = ClusterCount_SendMessage;
    for (let i = 0; i < max; i++) {
        await MessagingBotSubscriptionManager.SchedullerFirstStage(i);
    }
}
