//@ts-ignore
import { MasterManager } from '/opt/MasterManager';

export async function handler(event: any): Promise<any> {
    await MasterManager.ZuzonaSubscriptionsCleanup();
}
