//@ts-ignore
import ChannelCleanup from '/opt/ChannelCleanup';

export async function SubscriptionCleanUpChannelProcessorHandler(event: any): Promise<any> {
    await ChannelCleanup.ScandDDBForExpiredChannelSubscriptions();
}
