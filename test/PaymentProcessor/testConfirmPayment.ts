import { IncomingPaymentConfirmationHandler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: '76213deb-be3e-4674-93c3-61030a899d71',
            receiptHandle:
                'AQEBMYLSg+V9zCjSy6VPOA6vdH4qFJAFsCx7WlzIBM2TM2oJpM0+DCrpsZQ45+hM8oO61Y10hhL+2EfshnKa+JXPIzRwfAa682tXyFIF2iIGH0QTz8b+T/TuoVaktyg7erpTVNHrb+owsQiM3wLuAwpJhwbFJp1rRx2BR8UjUYmtSRafMd93kHme75CUJC8m/GV6Bit01koTca5FMSfP2zBsYI4CVOjgLhsZPVjrf5zDtFLPaqaaNa1T7nTiaarHMkBk6KWYQydQeFhEjYlnJ/PHIwJWj9ZXNZfrchqWHunrfa2bLWe6IKfvQfySCYmRdMil',
            body: '{"discriminator":"IRequestToConfirmPayment","botId":5795087844,"masterId":"199163834","id":"2OxiaNztJETBopZr4PIbF6K1ZlP","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1682508698937',
                SequenceNumber: '18877466300637424384',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2OxiagiTCoSqEW1rVXvm7aKWg1E',
                ApproximateFirstReceiveTimestamp: '1682508698937'
            },
            messageAttributes: {},
            md5OfBody: '12df2b076b678edd297dca8ab9f62c2b',
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
