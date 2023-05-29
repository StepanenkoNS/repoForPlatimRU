import { handler } from 'services/SendMessageScheduler/SendMessageSender';

const event = {
    Records: [
        {
            messageId: '1913a117-49f2-457d-849d-1b0626dfab49',
            receiptHandle:
                'AQEBgjwGbSqAxsjnv3QVHSK6WBPdNnxbXi0waROvYOSWdAJ4hnXGnPNETK7mRPWgn7rh6CXbJ4WbT1w8r+65hwtShF7AOxMXIO/O+DXXw9nLLD+jYOholN4TdjR69IWZyH9bRqP0lQB9QIq+N71eaP1rorV797G/0KB6Z3cyA5lh+a8gY7D2MuM8xqFgbrtwne80dTH3dm+fTP5nBI9ABaoMDKvMjNWLBFUBgH/MXHVEN8GhGoVqtRPbO/9xEJ0DvdPBFgG5tDdZjfHl0bDLTUuSiaHdYXLqHgAnr9jt7RBKH39tJiESz7D1hdiEXMcozRZD',
            body: '"{\\"messageBody\\":{\\"chat_id\\":199163834,\\"text\\":\\"2PHSjbkxJz9BW0W1eati8aLmCal\\",\\"parse_mode\\":\\"HTML\\",\\"disable_web_page_preview\\":true,\\"protect_content\\":true},\\"botId\\":5795087844,\\"masterId\\":199163834,\\"sendMethod\\":\\"sendMessage\\"}"',
            attributes: {
                ApproximateReceiveCount: '3',
                AWSTraceHeader: 'Root=1-645242ed-3e835214345a2db90e953d87;Parent=3f0f15ba2b9b76ab;Sampled=0;Lineage=7000cfdc:0',
                SentTimestamp: '1683112687422',
                SequenceNumber: '18877620921689586688',
                MessageGroupId: 'BOTID#5795087844',
                SenderId: 'AROA6OX3PF47QXKAKNQT4:SendMessage-Scheduller-Second-Stage',
                MessageDeduplicationId: '2PHSoOwCas94JM9SxL9tU4dATT6',
                ApproximateFirstReceiveTimestamp: '1683112687422'
            },
            messageAttributes: {},
            md5OfBody: '03ab35f43b381ef2a09022ec2b2b297f',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:scheduler-SendMessage-Second-Queue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    handler(event as any);
}

main();
