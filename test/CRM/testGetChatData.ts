import { handler } from 'services/CRM/GetAdminChatMessages';

async function main() {
    const result = await handler(event as any);
    console.log(result);
}

main();
