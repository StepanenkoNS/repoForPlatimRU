import { PomponaSubscriptionsProcessor } from '/opt/PomponaSubscriptionsProcessor';

export async function handler(event: any): Promise<any> {
    await PomponaSubscriptionsProcessor.PomponaSubscriptionsCleanup();
}
