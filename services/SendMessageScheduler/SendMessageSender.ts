import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { MessageSender } from '/opt/MessageSender';
import { IMessageSenderInput } from '/opt/ContentTypes';

export async function handler(event: SQSEvent) {
    const batchItemFailures: any[] = [];
    console.log('SendMessageSchedullerHandler - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body) as IMessageSenderInput;
            const result = await MessageSender.SendQueuedMessage(body);
            if (result === false) {
                throw 'SendQueuedMessage result is false';
            }
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    return { batchItemFailures };
}
