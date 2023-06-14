import { handler } from 'services/SubscriptionProcessor/expireUserSubscriptionItem';

const event = {
    Records: [
        {
            messageId: '238bf22e-f081-4371-ab53-88152c4d1596',
            receiptHandle:
                'AQEBov+FzDF2XtMT4WlYUmKqr7+XNgBjcKfRkS9CWywrN+CwZJ0iVUj6+uZN6iLCMN/XNtrsCle0rvR1VrSYM8SlIT5jrQpJp1qprQjYQ8FZHRxuA/tt3wUqrwKyLN6OZIdzqbszNsOJnOr/bzVMmh9YM2+3h3Burgpp/Oz36oEt7tKDs5tIdTUT1zQEZwPtfsmGycMkQN4sci+XEVi6/CA6oBeoZ8RJmKMDq5V0hniFO79uZVipUtzJqsti8FcJ3sh8TW7lZZ/8A0P220jy2stKs+qXoD0FLtmwBNx8H48mWdOC5tA/3JFqxe9oAIMD6D84',
            body: '{"planId":"3GC4zsRVqhXO","currency":"RUB","DF":"2023-05-06T11:52:43.877Z","pricePaid":100,"chatId":199163834,"discriminator":"IChannelSubscriptionInDDB","GSI1SK":"2023-05-04T11:52:43.877Z","GSI3SK":"SUBSCRIPTIONCHANNEL#ACTIVE","masterId":199163834,"GSI2SK":"CHANNELID#-1001874319435#CHATID#199163834","botId":5795087844,"GSI2PK":"USERCHANNELSUBSCRIPTION#MASTER#199163834#BOTID#5795087844","DS":"2023-05-04T11:53:30.676Z","GSI1PK":"SUBSCRIPTIONCHANNEL#ACTIVE","GSI3PK":"USERCHANNELSUBSCRIPTION#MASTER#199163834#BOTID#5795087844#SUBSCRIPTIONPLAN#3GC4zsRVqhXO","channelId":-1001874319435,"planName":"Короткая подписка","SK":"USERCHANNELSUBSCRIPTION#2PKMEkQ4hz4TWlXxMQfSIodPSDA","id":"2PKMEkQ4hz4TWlXxMQfSIodPSDA","PK":"USERCHANNELSUBSCRIPTION#MASTER#199163834#BOTID#5795087844#CHATID#199163834"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-6453a8eb-500376166fc97b397c7c0b70;Parent=42efeb3d77c47208;Sampled=0;Lineage=9c479de5:0',
                SentTimestamp: '1683204332655',
                SequenceNumber: '18877644382869232896',
                MessageGroupId: 'BOTID#5795087844',
                SenderId: 'AROA6OX3PF47Q6XJJPSEM:subscriptionProcessor-Expire-ChannelSubsriptions',
                MessageDeduplicationId: '2PKSZCCVJHIhp7O3OotqeprD4I3',
                ApproximateFirstReceiveTimestamp: '1683204332655'
            },
            messageAttributes: {},
            md5OfBody: 'b9a62fdbc9d5f2cfabaa82d36daca6fd',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:scheduler-expireSubscriptionQueue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    handler(event as any);
}

main();
