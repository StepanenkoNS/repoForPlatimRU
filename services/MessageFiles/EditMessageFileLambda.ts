import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListResult, ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { FileS3Configurator } from '/opt/FileS3Configurator';

import { S3Helper } from '/opt/S3/S3Utils';
import { IMessageFile } from 'tgbot-project-types/TypesCompiled/ContentTypes';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'id', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 's3key', datatype: 'string' },
        { key: 'originalFileName', datatype: 'string' },
        { key: 'fileSize', datatype: 'number(positiveInteger)' },
        { key: 'tags', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const mediaType = S3Helper.GetMediaType(bodyObject.data.originalFileName);
    if (mediaType === false) {
        const dataResult = ParseItemResult(undefined);

        return await ReturnRestApiResult({
            statusCode: dataResult.code,
            method: 'EDIT',
            masterId: Number(telegramUser.id),
            data: dataResult.body,

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const messageFile: IMessageFile = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),

        id: TextHelper.SanitizeToDirectText(bodyObject.data.id),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        s3key: TextHelper.SanitizeToDirectText(bodyObject.data.s3key),
        mediaType: TextHelper.SanitizeToDirectText(mediaType.type) as any,
        originalFileName: TextHelper.SanitizeToDirectText(bodyObject.data.originalFileName),
        fileSize: Number(TextHelper.SanitizeToDirectText(bodyObject.data.fileSize)),
        tags: bodyObject.data.tags
    };
    //если указан s3Key - то будем менять старый файл
    const result = await FileS3Configurator.UpdateMessageFile(messageFile);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'EDIT',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
