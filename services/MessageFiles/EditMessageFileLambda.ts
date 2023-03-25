import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListItemsResult, ParseUpdateItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore
import { EMessageFileType } from '/opt/ContentTypes';
import BotManager from '/opt/BotManager';
import { S3Helper } from '/opt/S3/S3Utils';

export async function EditMessageFileHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'BOTUUID', datatype: 'string' },
        { key: 'id', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 's3key', datatype: 'string' },
        { key: 'originalFileName', datatype: 'string' },
        { key: 'fileSize', datatype: 'number(positiveInteger)' },
        { key: 'tags', datatype: 'array' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const mediaType = S3Helper.GetMediaType(bodyObject.originalFileName);
    if (mediaType === false) {
        const addResult = ParseUpdateItemResult(undefined);

        return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
    }

    //если указан s3Key - то будем менять старый файл
    const result = await ContentConfigurator.UpdateMessageFile({
        masterId: telegramUser.id,
        messageFile: {
            BOTUUID: bodyObject.BOTUUID,
            id: bodyObject.id,
            name: bodyObject.name,
            s3key: bodyObject.s3key,
            mediaType: mediaType.type,
            originalFileName: bodyObject.originalFileName,
            fileSize: bodyObject.fileSize,
            tags: bodyObject.tags
        }
    });

    if (result !== undefined && result !== false) {
        const botManager = await BotManager.GetOrCreate({
            masterId: telegramUser.id,
            userName: telegramUser.username
        });
        const validateLimits = await botManager.UpdateSubscriptionLimit({
            resourceConsumption_mediaFiles: result.newFileSize - result.oldFileSize
        });
    }

    const updateResult = ParseUpdateItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
