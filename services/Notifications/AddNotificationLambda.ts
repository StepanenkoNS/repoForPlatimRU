import { TextHelper } from 'opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from 'opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from 'opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListResult, ReturnRestApiResult } from 'opt/LambdaHelpers/ReturnRestApiResult';

import { INotification } from 'tgbot-project-types/TypesCompiled/NotificationTypes';
import { Notifications } from 'opt/Notificatications';

export async function handler(event: SQSEvent) {
    console.log(event);
    const batchItemFailures: any[] = [];
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body) as INotification;

            const item: INotification = {
                id: body.id,
                dt: body.dt,
                new: body.new,
                data: {
                    type: body.data.type,
                    targetId: body.data.targetId,
                    chatId: body.data.chatId
                },
                masterId: body.masterId,
                botId: body.botId
            };
            const result = await Notifications.AddNotification(body);
            if (result.success === false || !result.data) {
                throw 'AddNotification result is false';
            }
        } catch (e) {
            console.log(`Error in processing SQS consumer: ${record.body}`);
            console.log(e);
            batchItemFailures.push({ itemIdentifier: record.messageId });
        }
    }
    return { batchItemFailures };
}
