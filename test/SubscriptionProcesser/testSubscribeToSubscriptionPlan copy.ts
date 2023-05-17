import { handler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: '2aa5175d-4032-4ff0-82f0-94eb5bd334b7',
            receiptHandle:
                'AQEB67szv0wpN1M0NuLk2/Q2m0Dgd/0ofz9WJaOk+FPTjdBQxpLIgWGfWc0oFJa3X3JLhWab48wmzclfY2VznUJp9jdJjeP40+3dlgGK6bf1RL4rmkKKNzY3cTjwk527TXIHMFmSPrx0gQnp03DoB1ALDbvEjQ3WDPvmspzfjOPCDytX6OYXCuO8Shp3BTMgP5/bZlwhNzeSQR5ds9BuCksvRArN57bbq0J4JNgPnTKDvkERotDamPb3T0lvgBLHBKBx5jL+8Nzs8w8Icx8zVkx1IxMZDPRips3rtc4OZYZFNlxWnjo3qm1B1ZRJ6GFD8wuXdB+kKJf7OPBkUrIbmP3/1g==',
            body: '{"id":"2PrkCPgIWNQyn56FN7UTDqYap8U","type":"BOT","botId":5795087844,"chatId":199163834,"masterId":199163834,"userSubscriptionPlanId":"X-fNVHzi_jqL","pricePaid":10000,"currency":"RUB","paymentId":"2PrkCPgIWNQyn56FN7UTDqYap8U"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-6463324e-ca9c53e461c6cde1fbae372e;Parent=3976c2f84438e5c5;Sampled=0;Lineage=7acea675:0|47d82b4f:0|afaacee2:0',
                SentTimestamp: '1684222544274',
                SequenceNumber: '18877905045043695872',
                MessageGroupId: 'BOTID#5795087844#CHATID#199163834',
                SenderId: 'AROA6OX3PF47YHSNJQCXT:paymentProcessor-IncomingPaymentConfirmation',
                MessageDeduplicationId: '2PrkMzncrdnx5PbWHrlKT4qb9HJ',
                ApproximateFirstReceiveTimestamp: '1684222544274'
            },
            messageAttributes: {},
            md5OfBody: 'ccfb7782e1f86315797b09e65e9c9c1b',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:SubscriptionProcessor-SubscribeTo-SubscriptionPlan.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    handler(event as any);
}

main();
