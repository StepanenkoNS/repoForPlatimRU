import { handler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: 'ecc498ac-8f6c-4996-83fa-fb380454b965',
            receiptHandle:
                'AQEB1Yz8ZzNDa6Yg7LitJBBfRvoSF9F65v/5gl53kXNHKGVTg5H4wdn2LJ6ZRzUmxI2mglV9HY6QpfBEDBUBJKkTmzOYF0OYEc/n6xkCaHnBtlG1YUIXrvOCxTV0bXsBHy6JDAQJeSLBrvnns0E8ewXo4lfDWNXMhhVjTsFiXRcVwS8TQIL6BQEeonwOiJnGTbl31hQ+3cDJGeEVGRF8G3W9hJn7rdfYY+Tonckx87v4SJ60w+0s3jQK54fyXHOYjyC31NQF53K8F+xPaJ+pvK13HfrtWjpIWLNCf+f0gRdAj2KMo5wxTzgaXvZ4DFBR4ELg',
            body: '{"discriminator":"IRequestToConfirmPayment","botId":5795087844,"masterId":199163834,"id":"2QBuMSEpxCDhIHuq9Z2xiZsUXVZ","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1684839277776',
                SequenceNumber: '18878062928820210688',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2QBuQELiob6g13yh0zUgxyIy4D6',
                ApproximateFirstReceiveTimestamp: '1684839277776'
            },
            messageAttributes: {},
            md5OfBody: '828a2ad9b08dd5cff5c67a2e7f98400e',
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
