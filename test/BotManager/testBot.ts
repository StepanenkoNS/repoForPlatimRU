//@ts-ignore
import BotManager from '/opt/BotManager';
import { IMasterBot } from '/opt/ConfiguratorTypes';

const masterId = 199163834;
const bot: IMasterBot = {
    masterId: masterId,
    name: 'test bot',
    description: 'test bot description',
    token: '12312321:asdfdsfadsfds',
    registered: false,
    registeredBotId: undefined
};

const BOTUUID1 = '2MBJKWbf7h2yltundH1tar7ZdIE';
const BOTUUID2 = '2MBJTWssqUa2um0pDIBtdNqcJeP';
async function main() {
    //const result = await BotManager.AddMyBot(bot);
    const result = await BotManager.RegisterMyBot(masterId, BOTUUID2);
}

main();
