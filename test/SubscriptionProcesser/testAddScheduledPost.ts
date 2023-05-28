import { handler } from 'services/SubscriptionProcessor/AddScheduledPost';

const event = {
    Records: [
        {
            messageId: 'a6033ae5-284d-4c1a-a330-9e7177b32ef9',
            receiptHandle:
                'AQEBWA6jWerOd2lGZppZWLk9I6mO4iRsDFzX84rVOumfmEt/vA5/3IOHkEa3KUI4cvnAdFRi1/ab4ggRvk4wEphmOS+r56H/wbwWasBep71VEQXi1o1x3MBe5/m5Kngc5n8g7BtBauwNf6MUGx78yHopP4QLxiaUhMhjsxaIRVgFDuJNjDSBFEb61zY5fu1yhCfxmDha889TMOYSMM55pFJxOS4kZ/hzvIr7YNBrBYNYO09x/3iaWeKG4ZtRuhw/mzDUtDqMCKWz4k21yFxFamAX/l3NTsr5tXJATpLi4khw73OnZYA5dvtsnfDX8mWnK1qL',
            body: '{"masterId":199163834,"botId":5795087844,"contentPlanId":"KzYTRxBszFl4","contentPlanPostId":"fEYUZS1yVCIG","trigger":{"type":"SCHEDULE_DELAY","delay_minutes":10,"delay_hours":0,"delay_days":0}}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-6472dbb6-78023d4d0d3e55eb32f88d19;Parent=47bea582574f8755;Sampled=0;Lineage=ae15da57:0|c6a0096e:0',
                SentTimestamp: '1685248952735',
                SequenceNumber: '18878167805609711872',
                MessageGroupId: '#POSTID#fEYUZS1yVCIG',
                SenderId: 'AROA6OX3PF476EUBD4ZHY:react-ContentPlanPosts-Add-Lambda',
                MessageDeduplicationId: '2QPIn4LniFTmOLoKzZBF6OhXHvI',
                ApproximateFirstReceiveTimestamp: '1685248952735'
            },
            messageAttributes: {},
            md5OfBody: '2ec04665d432b42264fec4aefc3a7f2d',
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
