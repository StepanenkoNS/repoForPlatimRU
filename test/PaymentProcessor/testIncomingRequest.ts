import { handler } from 'services/PaymentProcessor/IncomingPaymentRequests';

const event = {
    Records: [
        {
            messageId: 'd017c2f4-b00a-41ea-9d5a-a71aaea60bb5',
            receiptHandle:
                'AQEBpAI1amXv2Hfu/H34H2F32qxUpXODt6O1hMyi8gJMBIoTSd/Eskgv5qgzJfTbKB5ybyZOX4CDsfRYiKv8espLsGI5ASEl63rwjlNsezl9n4wT0i8f2SpywXfrmH7WCgo6VME6bGI/V0VDe/OwgM9s4vvgdw++rqLG3DnuZHvlCha/qCa4QRKCq4KpDXiflxd3Mvb9QPJ9aGfaysQ+TPOR+8bdWQIqB8PFMWS3MuBrQUaz6t0gHsFoPdd3su1ZYw2f6SszIfig2tkYS2ZmbFBWbXSHLHXb52PU4YqNQ/FhGSUOB8Qk9QnMePFl8GxYIXFH',
            body: '{"chatId":199163834,"botId":5795087844,"masterId":199163834,"paymentTarget":"SUBSCRIPTION","subscriptionPlanId":"X-fNVHzi_jqL","subscriptionPlanName":"Вечная","subscriptionType":"BOT","price":10000,"currency":"RUB","paymentOptionId":"38e0w7e2RXHC","paymentOptionType":"DIRECT","telegramMessageText":"","telegramSendMethod":"sendPhoto","telegramFileId":"AgACAgIAAxkBAAIYI2RjMMfgbPDG0Q_N3RPPgWZUYTQSAAJaxTEblbAZSxKgVYaQn1coAQADAgADeQADLwQ"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1684222152071',
                SequenceNumber: '18877904944639729408',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2PrjZfrC733mXzpetclT1ecaEXu',
                ApproximateFirstReceiveTimestamp: '1684222152071'
            },
            messageAttributes: {},
            md5OfBody: '60b0b9fe4e606c4736b70ad66aba1732',
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
