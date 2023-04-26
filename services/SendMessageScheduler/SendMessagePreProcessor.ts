import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
import { IScheduledPostMessage } from '/opt/ContentTypes';

const sqs = new SQS({ region: process.env.region });

function SQSSendBatch(queueUrl: string, arrayOfMessage: any[]) {
    const chunkSize = 10;
    const promises = [];
    for (let i = 0; i < arrayOfMessage.length; i += chunkSize) {
        const chunk = arrayOfMessage.slice(i, i + chunkSize);
        const params = {
            QueueUrl: queueUrl,
            Entries: chunk
        };
        promises.push(sqs.sendMessageBatch(params).promise());
    }
    return promises;
}

export async function SendMessagePreProcessorHandler(event: IScheduledPostMessage[]): Promise<any> {
    console.log('SendMessageSchedullerHandler - incoming event', event);
    let start = new Date().getTime();
    const sqsSend = [];
    const ddbSend = [];

    for (const message of event) {
        const id = ksuid.randomSync(new Date()).string;
        const messageGroupId = 'BOTID#' + message.botId + '#CHATID#' + message.chatId;

        const messageParamsSend = {
            Id: id,
            MessageBody: JSON.stringify(message),
            MessageDeduplicationId: id,
            MessageGroupId: messageGroupId
        };
        sqsSend.push(messageParamsSend);

        const messageParamsDDB = {
            Id: id,
            MessageBody: JSON.stringify(message),
            MessageDeduplicationId: id,
            MessageGroupId: messageGroupId
        };

        ddbSend.push(messageParamsDDB);
    }
    let end = new Date().getTime() - start;
    console.log('event has been parced', end);
    const schedulerSendQueueURL = process.env.schedulerSendQueueURL!;
    const schedulerDDBUpdateQueue = process.env.schedulerDDBUpdateQueue;
    console.log(schedulerSendQueueURL, schedulerDDBUpdateQueue);
    const promises = [];
    start = new Date().getTime();
    const sendPromises = SQSSendBatch(schedulerSendQueueURL, sqsSend);
    const ddbPromises = SQSSendBatch(schedulerDDBUpdateQueue!, ddbSend);
    end = new Date().getTime() - start;
    console.log('batching completed', end);
    start = new Date().getTime();
    promises.push(...sendPromises);
    promises.push(...ddbPromises);
    await Promise.all(promises);
    end = new Date().getTime() - start;
    console.log('promises resolved', end);
}
