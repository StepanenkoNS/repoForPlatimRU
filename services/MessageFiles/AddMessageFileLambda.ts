import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import FileS3Configurator from '/opt/FileS3Configurator';
import { S3Helper } from '/opt/S3/S3Utils';
import { IMessageFile } from '/opt/ContentTypes';
//@ts-ignore

export async function AddMessageFileHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'name', datatype: 'string' },
        { key: 's3key', datatype: 'string' },
        { key: 'originalFileName', datatype: 'string' },
        { key: 'fileSize', datatype: 'number(positiveInteger)' },
        { key: 'tags', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    const mediaType = S3Helper.GetMediaType(bodyObject.data.originalFileName);
    if (mediaType === false) {
        const addResult = ParseInsertItemResult(mediaType);

        return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
    }

    const messageFile: IMessageFile = {
        discriminator: 'IMessageFile',
        masterId: Number(telegramUser.id),

        botId: Number(bodyObject.data.botId),
        name: bodyObject.data.name,
        s3key: bodyObject.data.s3key,
        originalFileName: bodyObject.data.originalFileName,
        fileSize: bodyObject.data.fileSize,
        mediaType: mediaType.type,
        attachedToPosts: [],
        tags: bodyObject.data.tags
    };

    const result = await FileS3Configurator.AddMessageFile(messageFile);

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
