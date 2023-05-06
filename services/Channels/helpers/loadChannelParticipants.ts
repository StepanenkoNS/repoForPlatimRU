import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';

export async function LoadChannelParticipants(data: { channelId: number }) {
    const apiId = 28013806;
    const apiHash = 'ffe7611fbfc7f8d4a94ecd725931706a';
    const session =
        '1AgAOMTQ5LjE1NC4xNjcuNDEBuyfMmQwurSpqcS/fhdUGBJq9kMKEW+wAh3ksUTmJ7HNxvQkV/89B7WkNoIe04nVcDqBoqc140yKBZqc6BA75CpJlaCMSHa3Gfe98KFX1dzsNTltrG+C4/+eN7QSSUrX7kglU7osrHEZwVr4O8FSz5WPyXoSX3hqv/JfrEIOTgwCl7NlHeZDvtvVZMV9+4nUxlJBDRz48ms2Kz3sYRDyB4mpS6W+BQW7QjX+ivyXeZWdrkcocAS/cBPwuOAN93jg5Q5dcs4L9fHpdSf1DbIoBLTCxogFJFOYWrfqF6rmG5XzTiU4a3H1cwrjzz4UeRs2FiTsCw7oScErC3B3D6qPYdQk=';
    const stringSession = new StringSession(session);

    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
        useIPV6: false
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
        console.log('Error:LoadChannelParticipants: cant connect to telegram', error);
        return false;
    }

    try {
        const channelEntity = await client.getEntity(data.channelId);
        let offset = 0;
        let limit = 200;

        const participants = await client.getParticipants(channelEntity, { offset: offset, limit: limit });

        const users = participants
            .filter((participant) => participant.className == 'User' && (participant.bot == undefined || participant.bot == false))
            .map((value) => {
                return {
                    id: value.id,
                    userName: value.username ? value.username : null
                };
            });

        return users;
    } catch (error) {
        console.log('Error:BanChannelMember', error);
        return false;
    }
}

async function main() {
    //1001720972417
    //1001874319435
    await LoadChannelParticipants({ channelId: -1001720972417 });
}

main();

// const result = await client.invoke(
//     new Api.channels.sea({
//         channel: channelEntity,
//         filter: new Api.ChannelParticipantsRecent(),
//         offset: offset,
//         limit: limit,
//         hash: BigInt(hash) as any
//     })
// );
// if ((result as any).users && Array.isArray((result as any).users)) {
//     console.log(Number((result as any).users[0].id.value));
// }
// //hash = result.accessHash;
// offset = offset + limit;
// limit = limit + 200;
// console.log(result);
