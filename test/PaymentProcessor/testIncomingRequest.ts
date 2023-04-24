import { IncomingPaymentRequestsHandler } from 'services/PaymentProcessor/IncomingPaymentRequests';

const event = {
    Records: [
        {
            messageId: 'aaa066fa-ad2d-456a-9f84-41be2f1217e6',
            receiptHandle:
                'AQEB/KM+CEOWSh2HK7GyG7nO7c+gQzIvLZUOCQRQK+n7NTQzLWjvyg0es+1e9kOfhDyQeu+FrzSdWKM1m1HYmy7UAzfRwewovvsGYQV6LmZSe/+VhdBY+mjU8kxOmNw8ZL+xsSnUpgEwZKWjeiiCMTImY20UY4Et2EwF0Z6yPXFNdh8rUBF6FmYBt2RExWP0uxElFI6gmmxZ6RLuW1dUxJARFlTpwyduzCP105hLa5AF3ObuU2zR5nyczoMXbQXTFzx0f9iUHml7mtWHXanDTqy0w2WdmGL3Tr3009DtxeP88w9se53kDENIzoYhTDH8DOjY',
            body: '{"discriminator":"IRequestForPaymentConfirmation","telegramSendMethod":"sendPhoto","chatId":199163834,"botId":5795087844,"masterId":"199163834","subscriptionPlanId":"4XkAl1WZAo6s","subscriptionPlanName":"План подписки бота#1","subscriptionType":"BOT","price":200,"currency":"RUB","paymentOptionId":"AZUBqGcJndzm","paymentOptionType":"DIRECT","telegramMessageText":"","telegramFileId":"AgACAgIAAxkBAAIGv2Q_25hmmaXItGBFeHuScrH-tAwRAAIexzEbfWgAAUr2aRxAodZ6ywEAAwIAA3kAAy8E"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681906604630',
                SequenceNumber: '18877312164494833920',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2Oe2D3JiHeN0rGpNynAAX6MbnaX',
                ApproximateFirstReceiveTimestamp: '1681906604630'
            },
            messageAttributes: {},
            md5OfBody: '526dc89212b4b3cfe6e06299d0043b9f',
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
