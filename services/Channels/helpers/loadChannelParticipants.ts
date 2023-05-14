import { TelegramClient, Api, Logger } from 'telegram';
import { LogLevel } from 'telegram/extensions/Logger';
import { StringSession } from 'telegram/sessions';
import { MessagingBotManager } from '/opt/MessagingBotManager';
import { ArrayResponse } from '/opt/GeneralTypes';

export async function LoadChannelParticipants(data: { channelId: number; masterId: number; botId: number }) {
    const apiId = process.env.API_ID!;
    const apiHash = process.env.API_HASH!;
    const tempSession = await MessagingBotManager.GetBotSessionKey(data.masterId, data.botId);
    try {
        if (apiId == undefined || apiId == '' || apiHash == undefined || apiHash == '') {
            throw 'telegram api_id and apiHash not defined';
        }
        if (tempSession.success == false || !tempSession.data) {
            throw 'token/session data is not defined';
        }

        const session = tempSession.data.sessionKey;

        const stringSession = new StringSession(session);

        const client = new TelegramClient(stringSession, Number(apiId), apiHash, {
            connectionRetries: 5,
            baseLogger: new Logger(LogLevel.ERROR),
            useIPV6: false
        });

        //@ts-ignore
        if (session == '') {
            await client.start({
                botAuthToken: () => tempSession.data!.token,
                onError: (err) => console.log(err)
            });

            //console.log('new session data', client.session.save());
            const newSession = stringSession.save();
            await MessagingBotManager.SetBotSessionKey({
                masterId: data.masterId,
                botId: data.botId,
                sessionKey: newSession
            });
        } else {
            await client.connect();
        }

        const channelEntity = await client.getEntity(data.channelId);
        let offset = 0;
        let limit = 200;

        const returnData: { id: number; userName?: string }[] = [];
        const participants = await client.getParticipants(channelEntity, { offset: offset, limit: limit });
        //здесь бы еще добавить фильтр по забаненным
        for (const participant of participants) {
            if (participant.bot == true) {
            } else {
                if ((participant as any).participant?.adminRights) {
                    //console.log('isAdmin', Number((participant.id as any).value), participant.username);
                } else {
                    //push
                    //console.log('notAdmin', Number((participant.id as any).value), participant.username);
                    returnData.push({
                        id: Number((participant.id as any).value),
                        userName: participant.username
                    });
                }
                //    console.log(participant);
            }
        }
        // const users = participants
        //     .filter((participant) => participant.className == 'User' && (participant.bot == undefined || participant.bot == false))
        //     .map((value) => {
        //         return {
        //             id: value.id,
        //             userName: value.username ? value.username : null
        //         };
        //     });

        return { success: true, data: returnData } as ArrayResponse<{ id: number; userName?: string }>;
    } catch (error) {
        console.log('Error:LoadChannelParticipants', error);
        return { success: false, data: [], error: error } as ArrayResponse<{ id: number; userName?: string }>;
    }
}

// async function main() {
//     //1001720972417
//     //1001874319435
//     await LoadChannelParticipants({ channelId: -1001881460213, masterId: 199163834, botId: 6176978106 });
// }

// main();

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
