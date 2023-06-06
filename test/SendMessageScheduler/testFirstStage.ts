import { handler } from '../../services/SendMessageScheduler/SendMessage-Scheduller-First-Stage';

const event = {
    Records: [
        {
            messageId: 'b0d7fd09-d775-45b0-a79a-53b11ade3ecd',
            receiptHandle:
                'AQEBf+RqJY5jUcBvNjVkck6Gb/gktOx9/vLjO1JvrVOTM3k6ds3NM906qPdKNSbu++pOU1aNZk6krI4+PVruWBKp7lRXgkAeorB3kP39piucdVRvQwIrmVcEXe/rpZUHbRQUfiCygMvt5cH/I8L+acsGYw3pxI8mRYCdIn4punriRz0ptSdOLcmcgY5vQ4CFjfxMwG+YiRoNRcaVFZU+398JxXT7bRP9jrsjA5poVFmnQDgITmHTSncMBsOVQJ85/LpRcHsJmrFQloEd1WaL7QT7HNym3QBmLmYhJY6kEdyl7pmNE+ai/2UsnVwv83Qp86sL',
            body: '[{"sendDate":"2023-05-15T20:31:36.664Z","contentPlanPostId":"klM6OfWW39O9","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#klM6OfWW39O9#RANDOMKEY#2PqUjmX8qK4agP52XrA3xgEDVs4","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"}]',
            attributes: {
                ApproximateReceiveCount: '1',
                AWSTraceHeader: 'Root=1-64629cb8-3d6d0e6008a072623fbe638e;Parent=0fb24d2022444e02;Sampled=0;Lineage=0caea918:0',
                SentTimestamp: '1684184248995',
                SequenceNumber: '18877895241452272384',
                MessageGroupId: 'SCHEDULEDMESSAGES',
                SenderId: 'AROA6OX3PF47U2RZIUCZH:SendMessage-Scheduller-First-Stage',
                MessageDeduplicationId: '2PqUkUTTaiAynrkczipexPIdqNL',
                ApproximateFirstReceiveTimestamp: '1684184248995'
            },
            messageAttributes: {},
            md5OfBody: '32866f8f990572ffa842e7e694941f52',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:scheduler-SendMessage-First-Queue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    await handler();
}

main();
