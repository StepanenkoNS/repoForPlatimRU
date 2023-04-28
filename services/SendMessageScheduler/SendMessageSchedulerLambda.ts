//@ts-ignore
import { ddbDocClient } from '/opt/DDB/ddbDocClient';

import AWS from 'aws-sdk';

//@ts-ignore
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
        chunkSize = Math.ceil(arrayLength / chunkCount);
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

export async function handler(event: any, context: any): Promise<any> {
    console.log('SendMessageSchedullerHandler - incoming event', event);
    console.log('start query', new Date().toISOString());

    const dataItems = await getAllData();
    console.log('query completed', new Date().toISOString());

    if (!dataItems || dataItems.length === 0) {
        return false;
    }

    const messages = [];

    const promises = [];
    for (const item of dataItems) {
        if (item.discriminator === 'IScheduledPostMessage') {
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
                sendDate: item.sendDate,
                userSubscriptionPlanId: item.userSubscriptionPlanId
            };
            messages.push(message);
        }
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
