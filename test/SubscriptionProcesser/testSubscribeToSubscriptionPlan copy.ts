import { handler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: '0ecb8ecb-713f-4f13-9630-ac3be06e74c5',
            receiptHandle:
                'AQEBdDNksYj5Hjm1cQxTLJSFbDCinxUUbM6WAf5j4PTaj9BDWM1SKtgaS9LCffUxi7/jTKkUhmWbObi9sTpR5bMpvoZa4TMHuqflkrjwT8P7cMXSIqC1O0B/ahdxSV+VpEbt7Lpf+ghulbfkKdQmIzEQ1lUBRNy6rQUDBtnEBJ0yrBDBgZIGwHdmqAXaAQI5vdV6rEpwNtwyztZ6p1ntyd+ikUncnVS6lIYl/qc2wdKUPjuNN8bVZeO+imuGY8+aDUF0+jyPUIXOt++XFcoe1FauaxS9L81/eTgUQQJCXRuWx8+enXdLYVXTA1ddFdPFTBSL4acEx3CbKkkyyYFQhXwItA==',
            body: '{"id":"2QTPnHIkiWUyaZFZwx5RVvQUNcq","type":"BOT","botId":5795087844,"chatId":199163834,"masterId":199163834,"userSubscriptionPlanId":"GXi-AlSGxVtN","pricePaid":100,"currency":"RUB","paymentId":"2QTPnHIkiWUyaZFZwx5RVvQUNcq"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-6474c730-6c48f597a7313162bb8db9c5;Parent=73fbd27e6c569c62;Sampled=0;Lineage=7acea675:0|47d82b4f:0|afaacee2:0',
                SentTimestamp: '1685374769313',
                SequenceNumber: '18878200014653680896',
                MessageGroupId: 'BOTID#5795087844#CHATID#199163834',
                SenderId: 'AROA6OX3PF47YHSNJQCXT:paymentProcessor-IncomingPaymentConfirmation',
                MessageDeduplicationId: '2QTPo3nse205WHbZwLFPYjiuHFf',
                ApproximateFirstReceiveTimestamp: '1685374769313'
            },
            messageAttributes: {},
            md5OfBody: '31cbe16682b32bf29635cabc24eb2528',
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
