import { SubscribeUserToSubscriptionPlanHandler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: '08c4a44d-baf0-46d4-9920-a308b917cb83',
            receiptHandle:
                'AQEBfyA3YM4js4qeJJdlVqwHUjkuOMYFMSp3n7chNO6Zpwm02y7+9nk9z8o73H2/hWhr2kwVT7yLU1h478Nto88hmMAbxXk+J8ptgoRcf9tTEEX79UJ3dpej3wizRuFBVVvq3lq+5RRlNIoKeNHoYda+CbvwUdNAx1Lug88zahgqmJZ/cdVar20x1nylbzDIw5hNPQhsZU2OBeKLuIvb5O8Mq+/75ywi5Bn4QEuTUNxZc3p24Rd1Qea9dU4azGCeMwmp4zwI0HJJwmHrpVSNFXB8Qs0oeVfPQ+KbXmIXIENZsfuvcNtuf95/IrWbT42hJtxgzQrr7WIBXX/jaVbh1WvYOg==',
            body: '{"id":"2OeF8RiG3XpgSpbS5pH2qUFQTXM","type":"CHANNEL","botId":5795087844,"chatId":199163834,"masterId":199163834,"userSubscriptionPlanId":"SzBJ3ZzkSinE"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681912985061',
                SequenceNumber: '18877313797885168128',
                MessageGroupId: '5795087844',
                SenderId: 'AROA6OX3PF47X2VAKNYOH:paymentProcessor-IncomingPaymentConfirmation',
                MessageDeduplicationId: '2OeF96FftgTIjqLDKpovRqZTxjH',
                ApproximateFirstReceiveTimestamp: '1681912985061'
            },
            messageAttributes: {},
            md5OfBody: '6f719ccf9ae66e8f9ada6286209ad7cf',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:SubscriptionProcessor-SubscribeTo-SubscriptionPlan.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    SubscribeUserToSubscriptionPlanHandler(event as any);
}

main();
