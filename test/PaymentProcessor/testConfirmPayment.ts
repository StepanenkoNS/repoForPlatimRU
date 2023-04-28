import { IncomingPaymentConfirmationHandler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: '2a05f5c8-903b-470c-a870-4ca2adb23215',
            receiptHandle:
                'AQEBidXlmknHv/7BNFyD269DESKr17eHjBVkKnO89UpLXjP1Inat3WF/HzqSgMmj6zg/XSWgkugfzjWZsyTVvyuVHva5/hU+ennEMFpcGrBtdCzztuPEUDZoUy3glknPh1fzXbLbFbGO1AlcEowm7iDTrWKScb5gJZrWxGJjHJGdMSj7NbR3YOUMGmZ5od/CATgmCWpypxxC1qVDk4EJWB9vByM3f0IyzcI3lxxGTKwZ/Yg+045ithehoChT5Bl53dL2cCwp6BxW+jicGe1k6YXuzjdENE8eSJzJ0RVQEvs/j4UhvQI1s0PgvAjmDrjlmYYc',
            body: '{"discriminator":"IRequestToConfirmPayment","botId":5795087844,"masterId":"199163834","id":"2P0rZYG94YcZ3HszvQnYlM1kxQm","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1682604909498',
                SequenceNumber: '18877490930541040384',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2P0rb5l1g9reb5DscFvEaVZ2ovH',
                ApproximateFirstReceiveTimestamp: '1682604909498'
            },
            messageAttributes: {},
            md5OfBody: 'e59a2f5548fe5c363f988826ddbb207d',
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
