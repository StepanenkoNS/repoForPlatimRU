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
import BotManager from '/opt/BotManager';
import { S3Helper } from '/opt/S3/S3Utils';
//@ts-ignore

export async function AddMessageFileHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 's3key', datatype: 'string' },
        { key: 'originalFileName', datatype: 'string' },
        { key: 'fileSize', datatype: 'number(positiveInteger)' },
        { key: 'tags', datatype: 'array' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }
    const botManager = await BotManager.GetOrCreate({
        masterId: telegramUser.id,
        userName: telegramUser.username
    });

    const validateLimits = await botManager.UpdateSubscriptionLimit({
        resourceConsumption_mediaFiles: Number(bodyObject.fileSize)
    });

    const mediaType = S3Helper.GetMediaType(bodyObject.originalFileName);
    if (mediaType === false) {
        const addResult = ParseInsertItemResult(mediaType);

        return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
    }

    if (validateLimits === true) {
        const result = await FileS3Configurator.AddMessageFile({
            masterId: telegramUser.id,
            messageFile: {
                discriminator: 'IMessageFile',
                BOTUUID: bodyObject.BOTUUID,
                name: bodyObject.name,
                s3key: bodyObject.s3key,
                originalFileName: bodyObject.originalFileName,
                fileSize: bodyObject.fileSize,
                mediaType: mediaType.type,
                attachedToPosts: [],
                tags: bodyObject.tags
            }
        });

        const addResult = ParseInsertItemResult(result);

        return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
    } else {
        const addResult = ParseInsertItemResult(undefined);

        return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
    }
}
