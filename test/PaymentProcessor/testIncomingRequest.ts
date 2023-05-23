import { handler } from 'services/PaymentProcessor/IncomingPaymentRequests';

const event = {
    Records: [
        {
            messageId: '852c8346-11d9-4f32-b753-37f6c4b70618',
            receiptHandle:
                'AQEBOblUWL/dpc54+xO2OQHmh0fosSH35IRFToO4c50VtmqCsnejKJNZdxHDv5/DBfLX5W2JHrvQkrAcOpiAKaUWgdseyS0RBDUFinuqwsvfDqYevzNKiGf9eC/0BuRSw/6Ubf2FN4h8+Gg1X4dIkQ4gsmeMb8aVJwIuSfdlKX8AsDqXL0o38kKlugEKumJX61MN818DeZmD6UsCgrgo9YdpCaFikRfHV+vAXsXdorgIYsTQf80xFn4zRnNWIQQulEFE5J+5rZVMMace1Adle2jRRKUczi2o5GtovBMjVjhfbk8xstVu3JhZW0DCQJV2saGn',
            body: '{"chatId":199163834,"botId":5795087844,"masterId":199163834,"paymentTarget":"DIGITALSTORE","digitalStoreCategoryId":"E4VtOK2Wp5O1","digitalStoreItemId":"E4VtOK2Wp5O1","categoryNameForUser":"Платный контент","itemNameForUser":"платный товар1","price":"1000","currency":"RUB","paymentOptionId":"4ej8dY9rrvZx","paymentOptionType":"DIRECT","telegramMessageText":"","telegramSendMethod":"sendPhoto","telegramFileId":"AgACAgIAAxkBAAIZLmRrfDbNwW2VvtioQe_pw8vFfjegAALByjEb-wVYSyGyRGEm2bXDAQADAgADeQADLwQ"}',
            attributes: {
                ApproximateReceiveCount: '3',
                SentTimestamp: '1684765751970',
                SequenceNumber: '18878044106213873152',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2Q9VOVCV8y8I8kstSAQC2QKlW41',
                ApproximateFirstReceiveTimestamp: '1684765751970'
            },
            messageAttributes: {},
            md5OfBody: 'bd6e44988269811e32b8982c8db00446',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:paymentProcessor-IncomingRequests.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    handler(event as any);
}

main();
