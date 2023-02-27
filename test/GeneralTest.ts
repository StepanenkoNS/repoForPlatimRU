async function main() {
    const sk = 'MASTER#12345#BOTUUID#54321';
    const indexOfBotUUID = (sk as string).indexOf('#BOTUUID#');
    console.log(indexOfBotUUID);
    const BotUUID = (sk as string).substring(indexOfBotUUID + 9, sk.length);
    const MasterId = (sk as string).substring(7, indexOfBotUUID);
    console.log(BotUUID);
    console.log(MasterId);
}

main();
