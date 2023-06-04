import { handler } from '../../services/CascadeDelete/CascadeDelete';
const event = {
    Records: [
        {
            messageId: '006750d5-7e98-4f8f-b559-2f4f1b0c84ee',
            receiptHandle:
                'AQEBuWxKarv/pdhr4inP5YLtYZqF3T6MZzSKJIsESPooe7TCmE8m0TVr2xAQPGox0DhDQ3AwZ/GqfE+GzSOAtwiniYvlonwg4GTWOnq2QLdYC4VQQNpsrFllnEog3m69EqNDmHXgcL20yZXqlOc9VpNoZs9UYnGu3J6ipcyunmronjGd5PuS6Cz7iCM3EEgjCuVVtTkUzpdmIGeO9SuMkse7c2CVBiUZj0UWHuTvtdvmmmfKJL862Oggs8usEK8rqQWcwux0jO6BLAEJYADuo3nKF204+UpmrtMvNSiXnnsahOg=',
            body: '{"target":"IDigitalStoreCategory_ALL","keys":{"masterId":199163834,"botId":5944896623}}',
            attributes: [Object],
            messageAttributes: {},
            md5OfBody: '640d34db088b1cc24acf3eac9988d19f',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:CascadeDeleteQueue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    const result = await handler(event as any);
    console.log(result);
}

main();
