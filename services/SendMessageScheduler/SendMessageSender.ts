import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

import { MessageSender } from '/opt/MessageSender';
import { IMessageSenderInput } from '/opt/ContentTypes';
import { ETelegramUserStatus } from '/opt/MessagingBotManagerTypes';

export async function handler(event: SQSEvent) {
    const batchItemFailures: any[] = [];
    console.log('SendMessageSchedullerHandler - incoming event', JSON.stringify(event));
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body) as IMessageSenderInput;
            const result = await MessageSender.SendQueuedMessage(body);

            if (result.success === false || !result.data) {
                throw 'SendQueuedMessage result is false';
            }

            if (![ETelegramUserStatus.OK, ETelegramUserStatus.BLOCKED].includes(result.data.status)) {
                throw 'Error in sending message ' + result.data.status;
            }
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    return { batchItemFailures };
}
