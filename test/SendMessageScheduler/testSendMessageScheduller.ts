import { SendMessagesShedulerHandler } from 'services/SendMessageScheduler/SendMessageSchedulerLambda';

const event = {};
async function main() {
    SendMessagesShedulerHandler(event as any, '' as any);
}

main();
