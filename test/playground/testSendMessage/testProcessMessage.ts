import { handler } from '../../../services/SendMessages/parseQueuedMessage';


const event = 
{
    Records: [
      {
        messageId: '6ae5753d-f85b-486b-a6c5-9c3fd47f4f91',
        receiptHandle: 'AQEBNc7C1slCrJ3gu7oIs5pCjfw6x/4/46luTTa00r5ev+qxukLPKnQgaVhd+rQlP6GmLhus7qQb7xn/hi8InTyrcEDJ5ZhJuQw8Ywr0zBMj/kUXAk7a5NOnCejQb8bFZbGrwTEAL+bTpFP2E59C7/pKjz7QDqYCIX+xVFv8M1RDjhwMep07k447dSuKNH4WfhFxFNFRfupCwPKRQ/zDEa93i9sSjq2hzSLXwfwY+4m5YdSPVUom3uzTIx5e34c8KzQkoF1RzIaQcNp91VkGbzxBMsOf6EdegbBlVtrqFrOZCtM=',
        body: '{"botId":"5647754848","chatId":199163834,"messageText":"<b>Header</b>"}',
        attributes: [Object],
        messageAttributes: {},
        md5OfBody: '0fdde6102e2fcdaa91d418ad9be5f453',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-east-1:993738567487:sendMessageToBot-sqs.fifo',
        awsRegion: 'us-east-1'
      }
    ]
  }

async function main() {
    //console.log(JSON.parse(event.toString()));
    // const key = "aaa";
    // if (key in ["aaa","bbb"]){
    //     console.log(key);
    // }

    await handler(event);
    
}

main();
