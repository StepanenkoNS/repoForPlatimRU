import { handler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: 'a0a2fb0a-af7d-4c0b-8c05-374ebcda3db9',
            receiptHandle:
                'AQEB0PjAZk6xFFMNVhP5md/6Nmac4sTap4xFFePsp4xOXERRoqoMPoGzB2aZkcnLxp6FOky+7JMzDHLjo/XN3n8RiCElOdFFK6Mmc2bBX+mv9c5EY+eIgQ7HqsbsOQMm9SpjMsg2OxYqeoLBPmDVIVHWKvkBJPKDWzcWzesnVcJx0Z2Ea1ctm9jR4PNGCEpZ5Py9lJPrX1ygaD2Ha0BOCRYfGagMRVlkv0egOL2VZZKx/OnBb3llD1mudj/GIzPsnSvIHE6+f4AALMmIOT6C46OA3yANlfQ3O6H1o7TeXr1g93+5oV5NJQn2/2tn7ItoXRLPRJ6du+2mleGBsM1Ju/JjVQ==',
            body: '{"id":"2QBnnCMwmqk363Y29kAaCbpNNEh","type":"CHANNEL","botId":5795087844,"chatId":199163834,"masterId":199163834,"userSubscriptionPlanId":"roD9e3Th553S","pricePaid":100,"currency":"RUB","paymentId":"2QBnnCMwmqk363Y29kAaCbpNNEh"}',
            attributes: {
                ApproximateReceiveCount: '3',
                AWSTraceHeader: 'Root=1-646c8ed5-27e49d3e326944ce5619ff1f;Parent=69458b1b0243e834;Sampled=0;Lineage=afaacee2:0',
                SentTimestamp: '1684836055357',
                SequenceNumber: '18878062103880943872',
                MessageGroupId: 'BOTID#5795087844#CHATID#199163834',
                SenderId: 'AROA6OX3PF47YHSNJQCXT:paymentProcessor-IncomingPaymentConfirmation',
                MessageDeduplicationId: '2QBntMmB7FgvYZV3V3A15XbMxUz',
                ApproximateFirstReceiveTimestamp: '1684836055357'
            },
            messageAttributes: {},
            md5OfBody: 'df99712e9bf4b909bec37408b6f1f43d',
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
