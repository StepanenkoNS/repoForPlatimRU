import { handler } from 'services/SubscriptionProcessor/SubscribeUserToSubscriptionPlan';

const event = {
    Records: [
        {
            messageId: '94405942-70fa-4832-9b34-dd4634251761',
            receiptHandle:
                'AQEBFpmedf81OcGJpk7wVy69rHo5rzG7zWJd766QgvKAhb0agmeo/i7+wtcZKC8rILXVhusIIZRTkFRCFooT68j7hJpkSX4edAZQAhjoAcnj0OsLDE7e5kAYJGvek7tQEuRBfgig7kaHL9lsY+GikEdRyWaxtpiKGzOCLzJLp40YHg5Z5RRziMugZTxIA/o1qwVlSMVa5qZOzpXImhrgnxjMgHRN4e7yVE/agRuxgS2KD+mNxnAkef3jJhsNEoI6UL0/eXULwDz00twHif3w+doFTlDFPNQ6FBDedmuoAxm7qvTvPlg5AjKibTjWugjfwOG45Z2SeBQHp0gWNOS7QgHi7g==',
            body: '{"id":"2QT7xzI9By3cHn3a5tev7aefNM6","type":"CHANNEL","botId":5795087844,"chatId":199163834,"masterId":199163834,"channelId":-1001881460213,"userSubscriptionPlanId":"0O60fczhTCJp","pricePaid":100,"currency":"RUB","paymentId":"2QT7xzI9By3cHn3a5tev7aefNM6"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-6474a76f-54ad1ec92fd1c50dcbd056bd;Parent=5acfac01030b45d7;Sampled=0;Lineage=7acea675:0|47d82b4f:0|afaacee2:0',
                SentTimestamp: '1685366640886',
                SequenceNumber: '18878197933776368128',
                MessageGroupId: 'BOTID#5795087844#CHATID#199163834',
                SenderId: 'AROA6OX3PF47YHSNJQCXT:paymentProcessor-IncomingPaymentConfirmation',
                MessageDeduplicationId: '2QT9KUIQjPttkK9nPEYz97Ou9XP',
                ApproximateFirstReceiveTimestamp: '1685366640886'
            },
            messageAttributes: {},
            md5OfBody: '0abe38da3a11cb770552e6802e76f513',
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
