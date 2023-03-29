import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ddbDocClient } from '/opt/DDB/ddbDocClient';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
import AWS, { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
import { IScheduledPostMessage } from '/opt/ContentTypes';

const lambda = new AWS.Lambda();

const getAllData = async (exclusiveStartKey?: Record<string, any>, allData: any[] = []): Promise<any[]> => {
    let queryParams = {
        TableName: process.env.botsTable!,
        IndexName: 'GSI1',

        KeyConditionExpression: '#GSI1PK = :GSI1PK AND #GSI1SK <= :GSI1SK ',
        ExpressionAttributeNames: {
            '#GSI1PK': 'GSI1PK',
            '#GSI1SK': 'GSI1SK'
        },
        ExpressionAttributeValues: {
            ':GSI1PK': 'SCHEDULED',
            ':GSI1SK': new Date().toISOString()
        },
        ScanIndexForward: true
    };

    if (exclusiveStartKey) {
        const tmp = {
            ExclusiveStartKey: exclusiveStartKey
        };
        queryParams = { ...queryParams, ...tmp };
    }
    const dbResponce = await ddbDocClient.query(queryParams);

    if (dbResponce.Items && dbResponce.Items.length > 0) {
        allData = [...allData, ...dbResponce.Items];
    }

    if (dbResponce.LastEvaluatedKey) {
        const lastKey = dbResponce.LastEvaluatedKey;
        return await getAllData(lastKey, allData);
    } else {
        return allData;
    }
};

const sendDataToLambda = (messages: IScheduledPostMessage[]) => {
    let chunkSize = messages.length;
    if (messages.length >= 400) {
        const arrayLength = messages.length;
        const arrayWeight = JSON.stringify(messages).length;

        const chunkCount = Math.ceil(arrayWeight / 220000);
        const chunkSize = Math.ceil(arrayLength / chunkCount);
    }

    console.log('chunkSize', chunkSize);
    const promises = [];
    for (let i = 0; i < messages.length; i += chunkSize) {
        const chunk = messages.slice(i, i + chunkSize);
        console.log('chunk', i);
        const params: AWS.Lambda.InvocationRequest = {
            FunctionName: process.env.SendMessagePreProcessor!,
            InvocationType: 'Event',
            Payload: JSON.stringify(chunk)
        };
        const lambdaPromise = lambda.invoke(params).promise();
        promises.push(lambdaPromise);
    }
    return promises;
};

export async function SendMessagesShedulerHandler(event: any, context: any): Promise<any> {
    console.log('SendMessageSchedullerHandler - incoming event', event);
    console.log('start query', new Date().toISOString());

    const dataItems = await getAllData();
    console.log('query completed', new Date().toISOString());

    if (!dataItems || dataItems.length === 0) {
        return false;
    }

    const messages: IScheduledPostMessage[] = [];

    const promises = [];
    for (const item of dataItems) {
        const message: IScheduledPostMessage = {
            discriminator: 'IScheduledPostMessage',
            PK: item.PK,
            SK: item.SK,
            botId: Number(item.botId),
            masterId: Number(item.masterId),
            chatId: Number(item.chatId),
            contentPlanId: item.contentPlanId,
            contentPlanPostId: item.contentPlanPostId,
            status: item.GSI1PK,
            sendDate: item.sendDate
        };
        messages.push(message);
        // const messageParams: SQS.SendMessageRequest = {
        //     QueueUrl: process.env.schedullerQueueURL!,
        //     MessageBody: JSON.stringify(message),
        //     MessageDeduplicationId: message.SK,
        //     MessageGroupId: messageGroupId
        // };
        // const it: SQS.SendMessageBatchRequestEntry = {
        //     Id: i.toString(),
        //     MessageBody: JSON.stringify(message),
        //     MessageDeduplicationId: message.SK,
        //     MessageGroupId: messageGroupId
        // };
        //sqsEntries.push(it);

        // const promiseSQS = sqs.sendMessage(messageParams).promise();
        // promiseSQS
        //     .then(() => {
        //         console.log('promise ' + j + ' resolved');
        //         j++;
        //     })
        //     .catch(() => {
        //         console.log('promise ' + j + ' failed');
        //         j++;
        //     });
        // promises.push(promiseSQS);

        // const promiseDDB = ddbDocClient.update({
        //     TableName: process.env.botsTable!,
        //     Key: {
        //         PK: item.PK,
        //         SK: item.SK
        //     },
        //     UpdateExpression: 'SET #GSI1PK = :GSI1PK',
        //     ExpressionAttributeNames: {
        //         '#GSI1PK': 'GSI1PK'
        //     },
        //     ExpressionAttributeValues: {
        //         ':GSI1PK': 'INPROGRESS'
        //     }
        // });
        // promises.push(promiseDDB);
        // i++;
        // console.log('promise ' + i + ' started');
        // const promise = ddbDocClient.update({
        //     TableName: process.env.botsTable!,
        //     Key: {
        //         PK: item.PK,
        //         SK: item.SK
        //     },
        //     UpdateExpression: 'SET #GSI1PK = :GSI1PK',
        //     ExpressionAttributeNames: {
        //         '#GSI1PK': 'GSI1PK'
        //     },
        //     ExpressionAttributeValues: {
        //         ':GSI1PK': 'INPROGRESS'
        //     }
        // });
        // promises.push(promise);
    }

    messages.sort((a, b) => {
        const aValue = a.botId.toString() + '#' + a.chatId.toString() + '#' + a.sendDate;
        const bValue = b.botId.toString() + '#' + b.chatId.toString() + '#' + b.sendDate;
        if (aValue > bValue) {
            return 1;
        }
        if (aValue < bValue) {
            return -1;
        }
        return 0;
    });

    console.log('cnt', messages.length);

    const tempMessages: IScheduledPostMessage[] = [];
    let currentBotUser = '';

    for (let i = 0; i < messages.length; i++) {
        try {
            if (currentBotUser === '') {
                currentBotUser = messages[i].botId.toString() + '#' + messages[i].chatId.toString();
            }
            if (currentBotUser === messages[i].botId.toString() + '#' + messages[i].chatId.toString()) {
                tempMessages.push(messages[i]);
            } else {
                promises.push(...sendDataToLambda(tempMessages));
                tempMessages.length = 0;
                currentBotUser = messages[i].botId.toString() + '#' + messages[i].chatId.toString();
                tempMessages.push(messages[i]);
            }

            if (i === messages.length - 1) {
                promises.push(...sendDataToLambda(tempMessages));
                tempMessages.length = 0;
            }
        } catch (error) {
            console.log('iteration error', error);
        }
    }

    console.log('before Promise.all', new Date().toISOString());
    await Promise.all(promises);

    console.log('after Promise.all', new Date().toISOString());
}
