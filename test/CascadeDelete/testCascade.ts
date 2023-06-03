import { handler } from 'services/CascadeDelete/CascadeDelete';
const event = {
    Records: [
        {
            messageId: 'a7fa4b95-5786-43b5-bde1-a570fba6629a',
            receiptHandle:
                'AQEBwvCQYMA/5W9FO7DPU+bpdyQJB0wBuy/t0LxzgAXvM03gsnRU3coA1U8Fb4/goVl9bHDlvRBPtfh9hY2pPYWiUvLaK+dAhMh4mDih9GGZOkaD/kbE9MAMsu7Rh8rtmigAvfLNi5P2uRqrL4OdGrntnOh/+5lVlmJMGM5lrj6ThB5iDCs3OnD2XPOSwdBifb22dnTwC5HXDmNWPcjzVYGwRwUBd5MbmuDImcaPCzabsZ01o4pxtMDHci68VD55+DPCHOW+vHAGwmsv/Pe+7+tBdXnezInsrKF2uB87mmYeIneRiSahcGWB61BaYuJmM6fg5Qbv9P+zn9RXOeiFjAaqvH6OK8vRm84pdKSaA5DpEgIg18ao/izandDoU/3L7vbj0mh9N6G/uLAab74n9kTqHg==',
            body: '{"masterId":199163834,"botId":5944896623,"target":"IMessagingBot","keys":{"masterId":199163834,"botId":5944896623}}',
            attributes: [Object],
            messageAttributes: {},
            md5OfBody: 'bee621f3b20aef84c2053b3925b32be3',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:CascadeDeleteQueue',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    const result = await handler(event as any);
    console.log(result);
}

main();
