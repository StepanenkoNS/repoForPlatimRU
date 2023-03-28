import { IncomingPaymentConfirmationHandler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: '5bfd4b78-e89c-4112-9a1a-ebcd56ea377c',
            receiptHandle:
                'AQEB6Dil7HepWE/6alLJBvbbUKe81HON14KyGGOn4ao68vfWoZIJljt8kiwtqUSE3eG/Os0TYzIEUi6q3dWkzCuHp+L4DvG2dpNyzFHH9Ad8cuzesQaSk21q9JDbMHqHFArZU3luMTaj0ThylZq+floRf/9Zmm5pVTfubm5WCZJwpEmHQB+19MM6ISN0cAvDcTXHA5a+omUFDjhLzGHRGPq1C1EKxVTVWi9GvkQRPTDJ9gOiyx0WRZx2v0T/iiMApEthvDNqLu7i9AtGHP0yl3gQgEruv9vIfys7mkGJPhBbRZzBv7bsmdlW7SrIBEexHe+k',
            body: '{"discriminator":"IRequestToConfirmPayment","chatId":"199163834","botId":5795087844,"masterId":199163834,"BOTUUID":"2MNHTeQWWxcV6r3T82vZQVzKR4l","id":"2NeEFbhyfMwbOE12bBOSmu0ht1x","action":"1"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1680016067571',
                SequenceNumber: '18876828187007727616',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2NeEIOdtMfCG2oejJyPnHlr6kns',
                ApproximateFirstReceiveTimestamp: '1680016067571'
            },
            messageAttributes: {},
            md5OfBody: '8af5f0ea279f0bb68937b2772959c5ea',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:paymentProcessor-ConfirmationRequest.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    IncomingPaymentConfirmationHandler(event as any);
}

main();
