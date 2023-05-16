import { handler } from 'services/SubscriptionProcessor/AddScheduledPost';

const event = {
    Records: [
        {
            messageId: '7fa053e7-f066-49cc-adc9-5da8e4144593',
            receiptHandle:
                'AQEBG+EAJdIA7f0fLupWtIYKoClPQAfUwT6Xj/DdMbpuNaVazJGCvDZlBQAAeyMqJ100Fmxae2HIbu1zxPI7c6u5MxeiNA3OjfMuA0LQjCKzb6sdAKH2bSfUajpwghCCZdkrkSUUW48ol8ClCU81G7ZERnkX5f+AS3/Khg6UMDc1CY3qTmItnzo0CirL7xxKqCB+PDS6Woh1gy/V2T6iOrIoP0Z0T8rTs592m6r1fGmYPie4XDawmVXhQuTs+dbsgU6cHEhzP4srfrkE1jN15e3s/ekunnYBXKrYx9+Y2uNaFL7QOyCj0vsgk4iQagpqVmPg',
            body: '{"masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN","contentPlanPostId":"54Y4bUnnyfub","trigger":{"type":"SCHEDULE_DELAY","delay_minutes":0,"delay_hours":0,"delay_days":0}}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-64628e09-49aee6d2168241f6113e9311;Parent=030b6ce532e6f9c4;Sampled=0;Lineage=c6a0096e:0',
                SentTimestamp: '1684180491268',
                SequenceNumber: '18877894279474159872',
                MessageGroupId: '#POSTID#54Y4bUnnyfub',
                SenderId: 'AROA6OX3PF476EUBD4ZHY:react-ContentPlanPosts-Add-Lambda',
                MessageDeduplicationId: '2PqN8OB691nrsEZQukNXYqs2ty8',
                ApproximateFirstReceiveTimestamp: '1684180491268'
            },
            messageAttributes: {},
            md5OfBody: 'ce998365ea0ca2c108ed7bec63df9904',
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
