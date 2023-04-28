//@ts-ignore
import { ChannelCleanup } from '/opt/ChannelCleanup';

export async function handler(event: any): Promise<any> {
    await ChannelCleanup.ScandDDBForExpiredChannelSubscriptions();
}
