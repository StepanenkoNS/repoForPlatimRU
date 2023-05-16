import { handler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: '2f75d76f-ba79-4ead-9e15-97483b611bb6',
            receiptHandle:
                'AQEBsOXSh+X8rOQLGjs3oxLMyj582hBubwoY9YxniLJlv/QzWlznGlZ+nVBIuSScZ4Q2m7Ms21YcQzh+dJYFtAKAmgLNjIRYH/NwIssfv4JhZyE8SF8yzUZHfUZnWxlSFqB9tUQC9rQiNWJO6/lF4kttTf3tbsfUKfHk6oiDDGmExpMkxL7qGGp6t8bcvqOBrsbCJX9yxcFD+JDu2InnUAVsuZbmyOMQQrwscJ7ixvqyTWddZQ87kSQt5o4hAi0F+z7+XX21e/Dmuj3UYPERZtV6xUDcMG2EpbojDo3tuQGex7Uja3ymlz4FakPa3VoJ5X6kkWkiQ4jU7M5GHSjcyglJfg==',
            body: '{"id":"2PpKpnQHqB5N4DQ2i6FdSGuSVPn","type":"CHANNEL","botId":5795087844,"chatId":199163834,"masterId":199163834,"channelId":-1001881460213,"userSubscriptionPlanId":"XYb5N0Z6cQZT","pricePaid":100,"currency":"RUB","paymentId":"2PpKpnQHqB5N4DQ2i6FdSGuSVPn"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1684149143932',
                SequenceNumber: '18877886254556144640',
                MessageGroupId: 'BOTID#5795087844#CHATID#199163834',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2PpLb1NeHRi2X33CoaeiEpmvqjt',
                ApproximateFirstReceiveTimestamp: '1684149143932'
            },
            messageAttributes: {},
            md5OfBody: 'f3bc4c26318820346649a806020ddabe',
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
