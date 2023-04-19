import { SubscribeUserToContentPlanHandler } from 'services/SubscriptionProcessor/SubscribeUserToContentPlan';

const event = {
    Records: [
        {
            messageId: '8329c466-492f-4ab4-8b35-a290ef2e3f7a',
            receiptHandle:
                'AQEBAxJDtEyxJ8TsN+PU0PeMH9qjYheHWxfp0JgzWD2Nrq7vZWDV81NqU0xLS4/RptKD5xDqMKimXoUR7UQyeDAdyuXPriX5gkbQnIZeJESdHU1PT77/JSfZpZSHlMiFwQbO/tgSRyrtdyTLbtJpdtdL+MiLFJXDQLPgUK324jdzYNGtNg51zuiXMQaJvJkU0iyYCN7pdyvM07NpTCMa8m5+hvjGNiw+PAul19TYJd+Lvr6NSE27zGXt4AxBuelkrBsWqktwqh01STg1MZp/Am0Zg/WWOaY5AgHeteM4v1EUA64=',
            body: '{"id":"2ObUMTFUn1UpPcstuAAkkUsaG7X","type":"BOT","botId":5795087844,"chatId":199163834,"masterId":"199163834","userSubscriptionPlanId":"FREEPLAN"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681828736099',
                SequenceNumber: '18877292230150897152',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2ObUMTFUn1UpPcstuAAkkUsaG7X',
                ApproximateFirstReceiveTimestamp: '1681828736099'
            },
            messageAttributes: {},
            md5OfBody: 'bdf5b57925f3b398686bcdf990411071',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:SubscriptionProcessorQueue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    SubscribeUserToContentPlanHandler(event as any);
}

main();
