import { handler } from 'services/PaymentProcessor/IncomingPaymentRequests';

const event = {
    Records: [
        {
            messageId: '33a8049f-b572-4604-bf74-300555691fd1',
            receiptHandle:
                'AQEB387AmZGH+eNO+EhgIQDa/frjxtOH83ECMRNs4WOD1NagLd+Hz1bPytIiF5DsRFfL8ZQzj+g9cpAmrrea8/llgFxZqVi2SWHtV2AnjkfbL/tf9P1NCT4jaXTMYTgAwSl+ohYt3C520n4bsDJAPzGXyWigTqtAqi7/dnbMsj/0swOx3M2z9zeif+gGToIR18bDk7Kp5A61bbyqCH7FKcqWltReniWrfSTzz9UV5FUoFtZ/Ojw0/WqV/oxmNwb/i7XFKLwoi5jGOwnGNCwrBApaq3OjdxsE/1yq+VhQdPCRSgjH2dWu4u9UgTclwAzkVzSj',
            body: '{"chatId":199163834,"botId":5795087844,"masterId":199163834,"paymentTarget":"SUBSCRIPTION","subscriptionPlanId":"-RFuaathceto","channelId":-1001881460213,"subscriptionPlanName":"qqewrew","subscriptionType":"CHANNEL","price":20000,"currency":"RUB","paymentOptionId":"oeghzkwkzudE","paymentOptionType":"DIRECT","telegramMessageText":"","telegramSendMethod":"sendPhoto","telegramFileId":"AgACAgIAAxkBAAIXFWRiDQ_i_EXR7V7GZI5FJ9KMZS3rAAIyxzEblbARS1Fti9z-2igeAQADAgADeQADLwQ"}',
            attributes: {
                ApproximateReceiveCount: '1',
                SentTimestamp: '1684147897953',
                SequenceNumber: '18877885935585520128',
                MessageGroupId: '5795087844',
                SenderId: 'AIDA6OX3PF47UX6FRE7SI',
                MessageDeduplicationId: '2PpJ4QjsjVfsdZPGWqIPGzxfx4W',
                ApproximateFirstReceiveTimestamp: '1684147897953'
            },
            messageAttributes: {},
            md5OfBody: 'b66008e5b89c41269e2e2ceb0ed99770',
            eventSource: 'aws:sqs',
            eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:paymentProcessor-IncomingRequests.fifo',
            awsRegion: 'us-east-1'
        }
    ]
};
async function main() {
    handler(event as any);
}

main();
