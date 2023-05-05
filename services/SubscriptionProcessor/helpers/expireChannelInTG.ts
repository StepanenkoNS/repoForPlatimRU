import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';

export async function BanChannelMember(data: { chatId: number; channelId: number }) {
    const apiId = 28013806;
    const apiHash = 'ffe7611fbfc7f8d4a94ecd725931706a';
    const session =
        '1AgAOMTQ5LjE1NC4xNjcuNDEBuyfMmQwurSpqcS/fhdUGBJq9kMKEW+wAh3ksUTmJ7HNxvQkV/89B7WkNoIe04nVcDqBoqc140yKBZqc6BA75CpJlaCMSHa3Gfe98KFX1dzsNTltrG+C4/+eN7QSSUrX7kglU7osrHEZwVr4O8FSz5WPyXoSX3hqv/JfrEIOTgwCl7NlHeZDvtvVZMV9+4nUxlJBDRz48ms2Kz3sYRDyB4mpS6W+BQW7QjX+ivyXeZWdrkcocAS/cBPwuOAN93jg5Q5dcs4L9fHpdSf1DbIoBLTCxogFJFOYWrfqF6rmG5XzTiU4a3H1cwrjzz4UeRs2FiTsCw7oScErC3B3D6qPYdQk=';
    const stringSession = new StringSession(session);

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5
    });

    try {
        //@ts-ignore
        if (session == '') {
            await client.start({
                botAuthToken: () => process.env.BOT_FATHER_TOKEN!,
                onError: (err) => console.log(err)
            });

            console.log('new session data', client.session.save());
        } else {
            await client.connect();
        }
    } catch (error) {
        console.log('Error:BanChannelMember: cant connect to telegram', error);
        return false;
    }

    try {
        const channelEntity = await client.getEntity(data.channelId);
        const participant = await client.getEntity(data.chatId);
        await client.invoke(
            new Api.channels.EditBanned({
                channel: channelEntity,
                participant: participant,
                bannedRights: new Api.ChatBannedRights({
                    untilDate: 400,
                    viewMessages: true,
                    sendMessages: true,
                    sendMedia: true,
                    sendStickers: true,
                    sendGifs: true,
                    sendGames: true,
                    sendInline: true,
                    sendPolls: true,
                    changeInfo: true,
                    inviteUsers: true,
                    pinMessages: true
                })
            })
        );
        console.log('successfully banned');
        await client.disconnect();
        return 'BANNED';
    } catch (error) {
        console.log('Error:BanChannelMember', error);
        await client.disconnect();
        return 'NOTBANNED';
    }
}
