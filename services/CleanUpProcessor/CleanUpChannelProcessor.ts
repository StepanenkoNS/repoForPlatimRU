//@ts-ignore
import ChannelCleanup from '/opt/ChannelCleanup';

export async function CleanUpChannelProcessorHandler(event: any): Promise<any> {
    await ChannelCleanup.ScandDDBForExpiredChannelSubscriptions();
}
