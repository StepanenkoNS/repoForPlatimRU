import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingArray, ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore

export async function AddMessageFileHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'name', datatype: 'string' },
        { key: 's3key', datatype: 'string' },
        { key: 'originalFileName', datatype: 'string' },
        { key: 'fileSize', datatype: 'number(positiveInteger)' },
        { key: 'tags', datatype: 'array' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.AddMessageFile({
        chatId: telegramUser.id,
        messageFile: {
            name: bodyObject.name,
            s3key: bodyObject.s3key,
            originalFileName: bodyObject.originalFileName,
            fileSize: bodyObject.fileSize,
            attachedToPosts: [],
            tags: bodyObject.tags
        }
    });

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
