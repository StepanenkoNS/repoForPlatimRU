import { handler } from 'services/BotCommands/AddBotCommandLambda';
const event = {};
async function main() {
    handler(event as any, '' as any);
}

main();
