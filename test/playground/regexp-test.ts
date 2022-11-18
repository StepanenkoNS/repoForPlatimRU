
const botToken = "5647754848:AAGoCADAcu0oDjvsVcWnWEJcazWg_kcCnvI";


async function main() {
    console.log(botToken);

    const botId = botToken.match(/\d+(?=:)/);
    if (botId) {
        console.log('matching');
        console.log(botId[0]);
        console.log(botId[1])}
    else {
        console.log('not matching')
    }
}

main();