import { SendMessageSenderHandler } from 'services/SendMessageScheduler/SendMessageSender';

const event = {
    Records: [
        {
            messageId: 'bdcb7828-0375-4b97-aa2c-68a4dea562bf',
            receiptHandle:
                'AQEB3M4HyKdeoIrNoeY4kILIWBAqjwrNo07AqOZ+EMhwnB80UCDofVDzSrwv3a6qbpT7UoY5uts2pbAe9c0lsIeJcuzD3t50qw/K0z50GfJpP7mrNgtyYticRwl43PGEDo+T1HFN3loXjtFizV1X4XWEwUb1ivQv+qU+kI34GcJ9YOOOGVPWp/9FIqjKwAQPUtj0PG+TgXNitTv8ohdc5Q77rEkJXDZMLGz0FQ8K5J0wGL4PCkfQaCqvupcITVyVm605QbcD0QKNQeUx+b0+NtEz1mZO4hKMY7AewHrK3m3Jpbc=',
            body: '{"discriminator":"IScheduledGenericMessage","botId":5795087844,"masterId":199163834,"chatId":199163834,"sendMethod":"sendMessage","message":{"id":"2OKpR8zh9aZoC4dgYFCNfr3sI9i","attachments":[],"text":"Вы были успешно подписаны","reply_markup":{"inline_keyboard":[[{"text":"Join","callback_data":",1:2OKnlyx6cY23LSoEOZBoo9DlaWs,2:30,3:0,4:199163834"}]]}}}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1681319119620',
                SequenceNumber: '18877161768332272384',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2OKpRNkf6KWfg3cKQ7sIFDdsTVp',
                ApproximateFirstReceiveTimestamp: '1681319119620'
            },
            messageAttributes: {},
            md5OfBody: 'eecae1c8910c9d732f3aa3e37bb92c74',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:scheduler-schedulerSendQueue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    SendMessageSenderHandler(event as any);
}

main();
