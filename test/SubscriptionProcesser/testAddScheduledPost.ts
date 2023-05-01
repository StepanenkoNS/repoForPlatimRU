import { handler } from 'services/SubscriptionProcessor/AddScheduledPost';

const event = {
    Records: [
        {
            messageId: '878987a9-1472-41cd-a13a-dd2ca96e9155',
            receiptHandle:
                'AQEBcTygT53W0m+ToVD6fnXhOJnksf66efehA36EPxKgEpqBrmzDrPoKom/EyOS3VknuVp+YHshK1W7+3LCv8Wjusc+4GQdW3tjc+P8jYPQiDDwUnjQqnIB1CqwYRLsi/2vYcXY6UjStpxxH1Z4HWh0+PD+XtxvezotbOOoBF1zGa4eim1DV06VKOF5qOT05NogZonedfVZze+O4dXwvzJz7ShviXLmKsSdVEJ6iK0nAsRjBzTqNe+AchPIyTxoiO/0gSxxFdOXqyLhbX9ZbVfWCrbA0+vaGVuclsBd6JjnMxI0F5f6Ul/Wshdpa8zj1GYqB',
            body: '{"masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN","contentPlanPostId":"2P9EmDBXZ2R2Zprmpag7ZaZxQOC","trigger":{"type":"SCHEDULE_DELAY","delay":{"days":0,"hours":0,"minutes":0}}}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-644e6bfc-36082ca871d81e6059b0d852;Parent=205af6e354a80984;Sampled=0;Lineage=c6a0096e:0',
                SentTimestamp: '1682861054724',
                SequenceNumber: '18877556503718895616',
                MessageGroupId: '#POSTID#2P9EmDBXZ2R2Zprmpag7ZaZxQOC',
                SenderId: 'AROA6OX3PF476EUBD4ZHY:react-ContentPlanPosts-Add-Lambda',
                MessageDeduplicationId: '2P9EmNc4UbCdXw1ECvrDbHp12m2',
                ApproximateFirstReceiveTimestamp: '1682861054724'
            },
            messageAttributes: {},
            md5OfBody: '757a4486ae1f05077b0e9976bdd2a83a',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:SubscriptionProcessor-Scheduler-AddPost.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    await handler(event as any);
}

main();
