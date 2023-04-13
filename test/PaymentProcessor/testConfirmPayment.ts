import { IncomingPaymentConfirmationHandler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: 'e21983bd-50ae-48c0-b6ef-fb2469978422',
            receiptHandle:
                'AQEBByeIzNisxtmEVmI2b8OFvNKubDT/Mu3bJdzLNuYl7/0e/ab37rcZxfo5TGXDxiY54s1fWmXCVmmeqV7hhwF5hiTdeaA/Yi75uxoyyMEZKY6cqcsuUSvjCIXPYUxkPnvj+5Vri7O0bMGgD/0PLlfSx3NieKqm7QAftr3E7MFbj4oY9Qo4t1I1P0VWQwW+JzI2BnIYkYPMMuwP3lhFt1WMrzp+e8RKqXIKJjQXlIj9FkGPOcXDe7gduoEvQoE+7ED7z21BN1eb9ljUzbDQ1vzuGBdbn7hqRPBJNB+1Dij5gNOVIjrZw7vbTnEwmgvGKApW',
            body: '{"discriminator":"IRequestToConfirmPayment","chatId":"1862254","botId":5795087844,"masterId":"199163834","id":"2OMn7y4oskSn4ehZ5aEcxTAFLst","action":"1"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681379431893',
                SequenceNumber: '18877177208274160128',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2OMngaUBNTByxlzULZbc7Txs1a4',
                ApproximateFirstReceiveTimestamp: '1681379431893'
            },
            messageAttributes: {},
            md5OfBody: '6bc98195b745239046447114947ad896',
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
