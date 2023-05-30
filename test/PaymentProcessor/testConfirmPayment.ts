import { handler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: 'd8f08620-879a-4be8-b97e-37a07c6d57c4',
            receiptHandle:
                'AQEB0welJ9feip1hH75xL09m6KnUAKyAZQO6qtKNRzU51O0+8ZgNh3e0x9QaU6RKThPmWUqxpXtcosjdSpxRmPZ+Zwcxo2h11Gs79yg75k5nKqfb56q2L/CS5BqmR/uVxlMuhQFw3Ss82r0oZok5Vi5C4L9oCocgxTMs4/bDifHDOcdSIaOHxXQdiNNCaIS0UL3tBFoqzfhj2iJS1CzcGeoIWHV239/TqW7E5wY4TaCYQb+xpWWEtfcLzxg9OOU1wCoyBGZOcEhw9iWPfW2c+3HG/E2T3B2a7FCKm7PWgA4Idhbvz+gobA/yyPkNvvzb4pc5',
            body: '{"botId":5795087844,"masterId":199163834,"id":"2QTOOyOUKovTxwSeXoKkMEpjZIh","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-6474c496-5dadc9a1753564e730a06ec4;Parent=1d23aa710e06c1c7;Sampled=0;Lineage=7acea675:0|47d82b4f:0',
                SentTimestamp: '1685374103078',
                SequenceNumber: '18878199844097519872',
                MessageGroupId: '5795087844',
                SenderId: 'AROA6OX3PF47TZJE6YIGG:Bot-messagingBot-Lambda',
                MessageDeduplicationId: '2QTOSPyNP8TtCJKRuLCSXs65Zyq',
                ApproximateFirstReceiveTimestamp: '1685374103078'
            },
            messageAttributes: {},
            md5OfBody: 'd8624240264cf6db1ecdcf3b2ba9fffa',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:paymentProcessor-ConfirmationRequest.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    handler(event as any);
}

main();
