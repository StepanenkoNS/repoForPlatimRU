import { SQS } from "aws-sdk";
import { v4 } from "uuid";
import {GenericEnqueueAsyncSendMessage} from "../../Types/Telegram/EnqueueSendMessageTypes";
import {GenericProcessAsyncSendMessage} from "../../Types/Telegram/ProcessSendMessageTypes";
import { nanoid } from "../Other/nanoid";


const sqs = new SQS({region:process.env.region});
const incomingMessagesSQSURL = process.env.incomingMessagesSQSURL!;
const parsedMessagesSQSURL = process.env.parsedMessagesSQSURL!;

export async function enqueueTelegramMessageIntoIncomingMessages (messageBody: GenericEnqueueAsyncSendMessage) {
    let messageGroupId: string = 'BOT#'+messageBody.botId;
    if (messageBody.chatIds.length>1) {
        messageGroupId = messageGroupId + '#CHAT#MANY'
    } else {
        messageGroupId = messageGroupId +'#CHAT#'+ messageBody.chatIds[0];
    }
    const messageParams:SQS.SendMessageRequest = {
        QueueUrl: incomingMessagesSQSURL,
        MessageBody: JSON.stringify(messageBody),
        MessageDeduplicationId: nanoid(),
        MessageGroupId: messageGroupId
    };
    const result = await sqs.sendMessage(messageParams).promise();
    console.log(result);
    return result;
};


export async function enqueueTelegramMessageIntoParsedMessages (messageBody: GenericProcessAsyncSendMessage) {

    let messageGroupId: string = 'BOT#'+messageBody.botId;
  
    const messageParams:SQS.SendMessageRequest = {
        QueueUrl: parsedMessagesSQSURL,
        MessageBody: JSON.stringify(messageBody),
        MessageDeduplicationId: nanoid(),
        MessageGroupId: messageGroupId
    };
  
    const result = await sqs.sendMessage(messageParams).promise();
    console.log(result);
    return result;
  
  };