import { APIGatewayEvent, APIGatewayProxyResult, Context, SQSEvent } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ddbDocClient } from '/opt/DDB/ddbDocClient';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
import { SQS } from 'aws-sdk';
import ksuid from 'ksuid';
import { IScheduledPostMessage } from '/opt/ContentTypes';
import MessageSender from '/opt/MessageSender';

export async function DDBUpdateInProgressHandler(event: SQSEvent) {
    const batchItemFailures: any[] = [];
    console.log('SendMessageSchedullerHandler - incoming event', JSON.stringify(event));
    return { batchItemFailures };
}
