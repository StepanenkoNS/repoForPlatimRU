import { handler } from 'services/PaymentProcessor/IncomingPaymentConfirmation';

const event = {
    Records: [
        {
            messageId: '741bd735-f636-4e6e-b336-57eaf8d37dc2',
            receiptHandle:
                'AQEBfh/MlqZOqLGIC0E7EqImVnsO83xk6KwsRgoyuKi+6JPHq1jG8q/+PtHJuA+zBgu/8JOoYJsvvgLRu4xriuz84uATkc+nJRzrDJNu2KyLfAmcavzLy9avy/NilwL7/88FZPYxY4Kk1fhPddQR6uSbDLRT5dxVa2Bt3bhNhZPlVffqyABSvcj/BuPIYptjTJexaDGyFFcMhB2Yd0cIMpfC0vNkeylU0HopTo0/KP5TYGBpcFYgUizaP54UOJTn4wiWvRCdDgqLyT3mIMZkq3TteuXHoyRhCMNOjUa3kfRcUuoz7jp6COzEG8DjqA0McRRE',
            body: '{"chatId":1862254,"botId":5795087844,"masterId":199163834,"paymentTarget":"SUBSCRIPTION","subscriptionPlanId":"roD9e3Th553S","channelId":-1001874319435,"subscriptionPlanName":"Короткая","subscriptionType":"CHANNEL","price":"100","currency":"RUB","paymentOptionId":"4ej8dY9rrvZx","paymentOptionType":"DIRECT","telegramMessageText":"","telegramSendMethod":"sendPhoto","telegramFileId":"AgACAgIAAxkBAAIaSWRtkeCoVI5XmEvJi1wqzxEWpCV9AAJMxTEbj7xwS5XoxQ0YvgghAQADAgADeQADLwQ"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-646d91e0-10fd91ea54cc99602df1cf62;Parent=4850ba3b5e890fd1;Sampled=0;Lineage=7acea675:0|47d82b4f:0',
                SentTimestamp: '1684902368938',
                SequenceNumber: '18878079080157679616',
                MessageGroupId: '5795087844',
                SenderId: 'AROA6OX3PF47TZJE6YIGG:Bot-messagingBot-Lambda',
                MessageDeduplicationId: '2QDyImMqBFzblnVFeom6gxgCDhO',
                ApproximateFirstReceiveTimestamp: '1684902368938'
            },
            messageAttributes: {},
            md5OfBody: '06e13ae323bbf924ae49020890f7c3c8',
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
