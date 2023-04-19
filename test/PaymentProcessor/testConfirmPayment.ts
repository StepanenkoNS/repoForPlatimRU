import { IncomingPaymentConfirmationHandler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: '01e3e335-af8e-46b9-9a58-c03a16173abd',
            receiptHandle:
                'AQEBcazGNjkZOUqXvwTX5fkYQIx4S9Qo8qikbRve89YDa74rO/1lCglEErzq47Z3o6zO90j8NSLQWOQoWAdJXxHfZXzyKr97+OPetxj01RsrB5Z2Vko6GicdLytgR+Vl3i7vRQfCpTspwUNQInYSgGzsZg2zFvUcgrpyfxmsCEReaoSgtIOuDflYBZzxEGCx/5rz8JSPdiiePGbEqBjMOU+mUcMeAzurJ6amaP7txuA/jcPhQyCcz2oDlULLxAmfWqljIdvxmgYxU/PbeCquoCjemOUYJGwy50d7IHWpoy5yDXLnF0LCjm4Is7vifkhefO9G',
            body: '{"discriminator":"IRequestToConfirmPayment","botId":5795087844,"masterId":"199163834","id":"2ObMrbhHdXXyK7ZYqC1illkqEGg","action":"Confirm"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681825058583',
                SequenceNumber: '18877291288706800640',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2ObMvPCwYB1swnvvBMic0EOtUDo',
                ApproximateFirstReceiveTimestamp: '1681825058583'
            },
            messageAttributes: {},
            md5OfBody: '5bc5ea27e3675ef8ad6e6c6a9dee9d71',
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
