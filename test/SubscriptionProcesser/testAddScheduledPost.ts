import { handler } from 'services/SubscriptionProcessor/AddScheduledPost';

const event = {
    Records: [
        {
            messageId: '430a862a-8585-4f72-b80c-2595322410f6',
            receiptHandle:
                'AQEBM4nvfmeSUl/rGYQ4x1yBUrRaUMuPkS+CaTrnHGEcmwqqd3km0X5moDOB+I08Zy75jIBWgrf9ZG+YW+Lp+eZ1kypwE/dWdzAQesa63qaJSeNKFJTIIkdVgl8uQPAhCL3HkrXwyDu3DRYR+wx1kVqzXmVNRbopuy1/isT7E3O8k57OYVlFypadiv3W/tAv9ovzZXPNCiMUODyHXcR3o99hizEEgfm36L8ajZkTdqkimG7F5CuKnT1J2911O/TTp85IWjer21/LQBXyp806ezgzV5cLVtqgCsWfmAyVbI5/kb1HxQOGoy8PcsRVMHffD4Ia',
            body: '{"masterId":199163834,"botId":5795087844,"contentPlanId":"lJUGkF6uWOur","contentPlanPostId":"Cv9OArpOrpNX","trigger":{"type":"SCHEDULE_DELAY","delay_minutes":0,"delay_hours":0,"delay_days":0}}',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-646348d6-582e10a502e811b85288e2c7;Parent=4ac20e08353ed5b2;Sampled=0;Lineage=c6a0096e:0',
                SentTimestamp: '1684228313020',
                SequenceNumber: '18877906521842672384',
                MessageGroupId: '#POSTID#Cv9OArpOrpNX',
                SenderId: 'AROA6OX3PF476EUBD4ZHY:react-ContentPlanPosts-Add-Lambda',
                MessageDeduplicationId: '2Prw3uAq1A8AZI3a7tEeCxICASp',
                ApproximateFirstReceiveTimestamp: '1684228313020'
            },
            messageAttributes: {},
            md5OfBody: '3cfd9988f7c82cbc782749e5534d2391',
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
