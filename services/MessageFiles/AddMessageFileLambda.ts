import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';
//@ts-ignore
import { FileS3Configurator } from '/opt/FileS3Configurator';
import { S3Helper } from '/opt/S3/S3Utils';
import { IMessageFile } from 'tgbot-project-types/TypesCompiled/ContentTypes';
//@ts-ignore

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
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
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'GET',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const mediaType = S3Helper.GetMediaType(bodyObject.data.originalFileName);
    if (mediaType === false) {
        const dataResult = ParseItemResult(mediaType);

        return await ReturnRestApiResult({
            statusCode: dataResult.code,
            method: 'ADD',
            masterId: Number(telegramUser.id),
            data: dataResult.body,
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const messageFile: IMessageFile = {
        masterId: Number(telegramUser.id),

        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        name: TextHelper.SanitizeToDirectText(bodyObject.data.name),
        s3key: TextHelper.SanitizeToDirectText(bodyObject.data.s3key),
        originalFileName: TextHelper.SanitizeToDirectText(bodyObject.data.originalFileName),
        fileSize: Number(TextHelper.SanitizeToDirectText(bodyObject.data.fileSize)),
        mediaType: TextHelper.SanitizeToDirectText(mediaType.type) as any,
        attachedToPosts: [],
        tags: bodyObject.data.tags
    };

    const result = await FileS3Configurator.AddMessageFile(messageFile);

    const dataResult = ParseItemResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'ADD',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
