import { SQS } from "aws-sdk";
import { nanoid } from "services/Utils/Other/nanoid";
import { v4 } from "uuid";


const sqs = new SQS({region:process.env.region});
const incomingBotEvents_SQS = process.env.incomingBotEvents_SQS!;


export async function enqueueTelegramBotEvent (message: any) {
    const messageGroupId: string = 'BOT#'+message.systemParameters.botFatherId+'#CHAT#'+message.systemParameters.chatId;

    const messageParams:SQS.SendMessageRequest = {
        QueueUrl: incomingBotEvents_SQS,
        MessageBody: JSON.stringify(message),
        MessageDeduplicationId: nanoid(),
        MessageGroupId: messageGroupId
    };
    const result = await sqs.sendMessage(messageParams).promise();
    console.log(result);
    return result;
};