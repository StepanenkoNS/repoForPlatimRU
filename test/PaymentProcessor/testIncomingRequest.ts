import { IncomingPaymentRequestsHandler } from 'services/PaymentProcessor/IncomingPaymentRequests';

const event = {
    Records: [
        {
            messageId: '246f9233-bc51-48ff-bf50-2b6ec5e0a9bf',
            receiptHandle:
                'AQEBBWnSoKRCujI8q+LvbW0yonL3MQd0Tj7Q0++b1T/Vsvqo+5l64etnSIoX2KPq79/QmujEA774iU2zxzCGpw2PhmUo5K1XgqsJA+dnxMoqfey3wJM1qo/8bSTBuqrxiO8zx9NihGz9sI+/+pNVN/qwX6VxT9T10PjkEFt5MhtPCHFXFF0xZiCwRukWhEoTeySO1DQAh9H7D26RQ8UY1XFesmBNNpIw9GyMbaFtw0csMJ0eul9olw66Res7dfTxqUfso9/JSvrR0Veyr1wTpmwDPvhpKHyRay+R/3uYM3+VrUt/DST8tf1pKMH54CLUtKEx',
            body: '{"discriminator":"IRequestForPaymentConfirmation","telegramSendMethod":"sendDocument","subscriptionTarget":"CHANNEL","chatId":199163834,"botId":5795087844,"masterId":"199163834","subscriptionPlanId":"2OJwv6tJKzAsiYIyEvtQhsYdCSv","subscriptionPlanName":"Подписка на первый канал","price":"2100","currency":"RUB","paymentOptionId":"2OBDzi1bz1okAfqYkNxOHRKc8Sq","paymentOptionType":"DIRECT","telegramMessageText":"","telegramFileId":"BQACAgIAAxkBAAIDy2Q3sMqw_0VeAAHjPV0mpVjJpgfqUgACzCYAAnvrwEncZvlHEE3Bty8E"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681371339026',
                SequenceNumber: '18877175136500207872',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2OMXHhlq1EKv2V2cOmbsgg1OHZM',
                ApproximateFirstReceiveTimestamp: '1681371339026'
            },
            messageAttributes: {},
            md5OfBody: '93e267a8bb542718d4be406355039254',
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
