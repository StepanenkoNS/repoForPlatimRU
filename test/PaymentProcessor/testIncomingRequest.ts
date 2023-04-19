import { IncomingPaymentRequestsHandler } from 'services/PaymentProcessor/IncomingPaymentRequests';

const event = {
    Records: [
        {
            messageId: '71b82b13-bb8d-47af-87a2-bb63d87bdc99',
            receiptHandle:
                'AQEBYyD8lN/KnVyH1GvXtB7PfD501ctfgzYm/rtKvnjJQABIjlRLd0UuMy9HZ9IJ81NtN0b3X/9VLhEkdVQ7Fkg+xgUS3BP7djOD3YPThpUyNrBtxid8Qt81CMS/3Jsr7+RJ/vjOPg1b2ZlmAmhdvxMB2aKHc+YZyso+XcMr1JXPILhH3uirqAGNHgGO2RMD6CLRTfNSLdd/9k/kac2ShHyM60niGR3+Da/BwBNEfjpkVE2jBMmASmc1fxyzp80roCEp7cdad9lLwygfj8HaPQ7uRF03K4QLyzd2qM5UoKOiiFstzIrDfge3WhOPf8+/6ycM',
            body: '{"discriminator":"IRequestForPaymentConfirmation","telegramSendMethod":"sendPhoto","chatId":199163834,"botId":5795087844,"masterId":"199163834","subscriptionPlanId":"4XkAl1WZAo6s","subscriptionPlanName":"Подписка бота 1","subscriptionType":"BOT","price":200,"currency":"RUB","paymentOptionId":"AZUBqGcJndzm","paymentOptionType":"DIRECT","telegramMessageText":"","telegramFileId":"AgACAgIAAxkBAAIFPmQ-k1WZ-g8LHhYnVVhIx9dZsruFAAJuwzEbkfv4SdsFkiHvUbtUAQADAgADeQADLwQ"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681822550526',
                SequenceNumber: '18877290646644209152',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2ObHqEsLwqs7lJ5X6gk07gTDMqV',
                ApproximateFirstReceiveTimestamp: '1681822550526'
            },
            messageAttributes: {},
            md5OfBody: '538e224653923177dc69545f30faa7fe',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:paymentProcessor-IncomingRequests.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    IncomingPaymentRequestsHandler(event as any);
}

main();
