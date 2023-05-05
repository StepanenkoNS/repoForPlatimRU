import { handler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: 'd5ccea38-20b6-408f-8e72-a9d0f373154f',
            receiptHandle:
                'AQEBylKNoe3sO3awOnpMEqVdTVI6HUSI3GsvKQBR75pQuOZJGfwMTbmf1wpp7M/CPvtAor89S3gWNDZJ46aH7jv0V5vRkw2lCF1he/5c1923Sz2Ju3E1wjs1nK4XDsyhqPLqKFWgTgujBji22GTvlSKVgzEPbOfkX0kM7KSjXC4px0Giq1aiMiyEUBax1Rk1vMHuoqh6n7UJg0YZnfzehXyk7m8OU7IfXkNvwSp4FgimG0FA5Z5PrMkfw8rUmiGkrIEfzZ0WFN4jQ+tetS5/X4X0wBP4S80MrAHCBwFXezunKylieBA41LbyxRpoDt7Q4qxa4/2hRZefx9Dii8jFJv41lQ==',
            body: '{"id":"2PKF5tCCoW2xY9mnrfbP3r34MOb","type":"CHANNEL","botId":5795087844,"chatId":199163834,"masterId":199163834,"userSubscriptionPlanId":"3GC4zsRVqhXO","pricePaid":100,"currency":"RUB"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-64538ef9-2fe0c957677e3abf44d52813;Parent=69dd8ca64f48b534;Sampled=0;Lineage=afaacee2:0',
                SentTimestamp: '1683197689601',
                SequenceNumber: '18877642682247408896',
                MessageGroupId: '5795087844',
                SenderId: 'AROA6OX3PF47YHSNJQCXT:paymentProcessor-IncomingPaymentConfirmation',
                MessageDeduplicationId: '2PKF6MP5egMV4VObIE8NSy091dg',
                ApproximateFirstReceiveTimestamp: '1683197689601'
            },
            messageAttributes: {},
            md5OfBody: 'de2b913f8a2f496fe41bf58c2d02907b',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:SubscriptionProcessor-SubscribeTo-SubscriptionPlan.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    handler(event as any);
}

main();
