import { handler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: 'd6503c9c-341a-4b9c-8f9b-9d26a6e0bf4f',
            receiptHandle:
                'AQEBCnp2QUimWLmYGVtNjokSiIQfMXXcAZ3q3iwRjv6RO0mrhbic8bJNkdb0Gildq01AR+NyPRM7IsSuO/eKFl2jsIjor+062HoNNcBuGnLqOyKj+gjQDZfkp7LtvWIKyz2w4EhTXbKY9LjFxMskRLL2mr6I1P4UIEOaW5G+fJsxhwM+q23uQ+O5Iht4qXNARtcCTSRee0mo1Sh3+jIkWjr9OryBMT6xlsjHwV0PGPmCt7uYNocwWTdn7GZcQnNAnHm0mlD4TYPkmhJNNNc61X9Por0lyuNdQRy8UPcQG7vZVWYAMZw+JuOTTnz5iLdx2pBa',
            body: '{"discriminator":"IRequestToConfirmPayment","botId":5795087844,"masterId":199163834,"id":"2PpKpnQHqB5N4DQ2i6FdSGuSVPn","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1684148772651',
                SequenceNumber: '18877886159508209152',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2PpKqIewwwvBWu37GNnjaj1QUit',
                ApproximateFirstReceiveTimestamp: '1684148772651'
            },
            messageAttributes: {},
            md5OfBody: '0893fbb0e8e626d8dc04d1a1eba05e95',
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
