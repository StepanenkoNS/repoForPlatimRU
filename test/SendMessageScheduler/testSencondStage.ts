import { handler } from '../../services/SendMessageScheduler/SendMessage-Scheduller-Second-Stage';

const event = {
    Records: [
        {
            messageId: '9d74f7ef-d172-48da-aaef-832c7938dc6f',
            receiptHandle:
                'AQEBv2FiqaOeqzMD9ledPagnScIYRFCERz4CMHlDVPDDYaT8/5d+GVMAka2gSXmvohPsixEtLhZIr07knj0IeI1kzA3HrN6Vx+sK+ERFqMNobT7hLiQWum+TwcA7hfHYgaUsV4yJNs4H9sMIzhy8NGbGEnD+7HWduuCsE8VuQpw+IjeJbNPjDnLOs2NOOpve6H1AtMvAAzYdTlWul4B7WIofmFQHMndau12+AXlyOQdv281KEMYBe35HonAO1EDdMxQI+ePIFwM1eUvVcWJzhr6ZjLitzuMkyQu3fmbjzLlSwKlCOymvzotYlC+5KJgZc5iY',
            body: '[{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"cWL_ulGhL9HF","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#cWL_ulGhL9HF#RANDOMKEY#2PHi6N5SVfUoMF1RMWAslOwM1pU","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"A8TPuGsUFWoF","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#A8TPuGsUFWoF#RANDOMKEY#2PHi7A24ppRPQv5veJhlDKMl3IG","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"PclQDZTn_kFS","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#PclQDZTn_kFS#RANDOMKEY#2PHi7O1SFk5f30lxL0RHnrqdknn","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"UQ-tguoJ73eZ","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#UQ-tguoJ73eZ#RANDOMKEY#2PHi7XG88FMhwS0vS9oCSaeQUEl","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"GSqIAOY5OVa2","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#GSqIAOY5OVa2#RANDOMKEY#2PHi6CdYgI8G7S6E3OltIpKZy0k","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"PZbwmxCirTum","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#PZbwmxCirTum#RANDOMKEY#2PHi6LAknrtyzdybJr3MlwG4tHq","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"gvzC_sZWJ26x","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#gvzC_sZWJ26x#RANDOMKEY#2PHi6s2dZ36mPjQTLacvl5iuAn3","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"BBHjXldUwJ07","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#BBHjXldUwJ07#RANDOMKEY#2PHi6sqiLo9dIHMZzXogcyZZqcE","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"gsWFDMGZiQhB","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#gsWFDMGZiQhB#RANDOMKEY#2PHi7YiFW6AVsikru4M2bfTUpqE","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"},{"sendDate":"2023-05-01T08:59:35.234Z","contentPlanPostId":"N05VOPVbqG5r","userSubscriptionPlanId":"FREEPLAN","SK":"USERSUBSCRIPTIONPLANID#FREEPLAN#CONTENTPLANID#FREEPLAN#CONTENTPLANPOST#N05VOPVbqG5r#RANDOMKEY#2PHi6dMXP4rcOoUs7g4lmudMRlC","chatId":199163834,"PK":"SCHEDULEDPOST#MASTER#199163834#BOTID#5795087844#USER#199163834","masterId":199163834,"botId":5795087844,"contentPlanId":"FREEPLAN"}]',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1683123635609',
                SequenceNumber: '18877623724425455872',
                MessageGroupId: 'SCHEDULEDMESSAGES',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2PHp0289bNgs6lDSjmYmYdPnMI0',
                ApproximateFirstReceiveTimestamp: '1683123638963'
            },
            messageAttributes: {},
            md5OfBody: '063115f4cd0575f797b96c32b957df11',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:scheduler-SendMessage-First-Queue.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};

async function main() {
    handler(event as any);
}

main();
