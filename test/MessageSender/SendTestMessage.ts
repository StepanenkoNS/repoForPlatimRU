//@ts-ignore
import MessageSender from '/opt/MessageSender';

import { IMasterBot } from '/opt/ConfiguratorTypes';
import { IContentPostGenericMessage } from '/opt/ContentTypes';

const masterId = 199163834;
const message: IContentPostGenericMessage = {
    id: '',
    text: 'asdfds',
    attachments: []
};

const BOTUUID = '2MECqb1sqZJ7fZ2fUaojyZDf0Kl';

async function main() {
    console.log('smth');
    const result = await MessageSender.SendTestMessage(masterId, BOTUUID, message);
}

main();
