import { ZuzonaSubscriptionsProcessor } from '/opt/ZuzonaSubscriptionsProcessor';

export async function handler(event: any): Promise<any> {
    await ZuzonaSubscriptionsProcessor.ZuzonaSubscriptionsCleanup();
}
