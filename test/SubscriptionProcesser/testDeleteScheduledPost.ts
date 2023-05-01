import { handler } from 'services/SubscriptionProcessor/DeleteScheduledPost';

const event = {
    Records: [
        {
            messageId: 'c01bc118-f382-4ea4-b026-37815f2b4cbd',
            receiptHandle:
                'AQEBgrz7NwKuUSRJRlJL8tk5uLeuowvvEeH0S/ti7Xl1BZtAcUqD/3STm/RXYbTCAldrxL8Tbg88kjqBQf2qb3bXxLHKNa8gc0dIV/qGR47pNxdn9k/SlRDLMxwghSczOlEsYZ4NjDe6rFiSOJgI7bqGVo6yoYH2rQ5zgEdrDySwtvfuTTqE85erfFFLsCP6vSqpTGrC7DSuP0GF+ip2OyiUIdKFw9ooowhGM6yT/cXCvAwXe5Lxj7dPUFeoKrQrqITjEO6F8cYZl5TBa5LhRn/e+JMVBP7pgpgZ4Kvfdyi8k1r1tMhbSqdo/L+9UFt434M+',
            body: '{"masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN","contentPlanPostId":"2P9QJSRYVpTQDZLS3l95dAx0QNF"}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-644e82c1-2e9fc9b31d37e678774cc9fe;Parent=12ee2516282eeb8a;Sampled=0;Lineage=2fff4bc8:0',
                SentTimestamp: '1682866882028',
                SequenceNumber: '18877557995508720384',
                MessageGroupId: '#POSTID#2P9QUWISTbRoJBPTIDxXySrih7E',
                SenderId: 'AROA6OX3PF47VEI4FOELA:react-ContentPlanPosts-Delete-Lambda',
                MessageDeduplicationId: '2P9QadxHJJG1Ig66HsdziM4LaQv',
                ApproximateFirstReceiveTimestamp: '1682866882028'
            },
            messageAttributes: {},
            md5OfBody: '56626e192591c945fb08e6020c524be1',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:SubscriptionProcessor-Scheduler-DeletePost.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    await handler(event as any);
}

main();
