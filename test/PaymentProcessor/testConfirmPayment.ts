import { handler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: '381d7c7e-48a1-4373-9877-3f95873a5de7',
            receiptHandle:
                'AQEBIgRI6p4zxC52+qpIR7rETlud+HSwzRnDrINRdnfQq2rLJe8rgrgS8JQe2uCnRSpOOCr6cdk1rhArXaKeDBgHjHUmrEfZRy+YHuhZ3qY1Q4nUNfTM0mOL6gq5oQLQPVNkrhzYnXJ63OdV4kmoZudEdmlrE4tCq8tpxIGwJ0ceQTgh7HC3XqYwUQ7QLMDuOIEWkGv7aQsgJr6YMu1hkAsLJc38EloEm3OGD4drQEhGlvui63w9HgS4WGzK4Cvme4oHksiRXKHulQL+slZTXOV2+UIBTQMBut/nWLSDNJayny8k2c7uRfGxsj2oxLM3KcPJ',
            body: '{"botId":5795087844,"masterId":199163834,"id":"2QPiNesJr8fLiZ8tha5Jo4nFD8d","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1685261583339',
                SequenceNumber: '18878171039044335872',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2QPiO960aT28oK03wWvZd8kD0WY',
                ApproximateFirstReceiveTimestamp: '1685261583339'
            },
            messageAttributes: {},
            md5OfBody: '184a1d3d9f01a112feadce5aa57574dd',
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
