import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from 'tgbot-project-types/TypesCompiled/AuthTypes';

//@ts-ignore
import { S3Helper } from '/opt/S3/S3Utils';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'fileName', datatype: 'string' },
        { key: 'fileType', datatype: 'string' },
        { key: 'fileSize', datatype: 'number(nonZeroPositiveInteger)' }
    ]);

    if (bodyObject.success === false) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'GET',
            masterId: Number(telegramUser.id),
            data: { success: false, error: bodyObject.error },

            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    const s3Result = await S3Helper.GeneratePreSignedURL_Put(
        process.env.tempUploadsBucketName!,
        Number(telegramUser.id),
        Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        TextHelper.SanitizeToDirectText(bodyObject.data.fileName),
        TextHelper.SanitizeToDirectText(bodyObject.data.fileType),
        1
    );
    console.log(s3Result);

    const dataResult = ParseItemResult(s3Result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'GET',
        masterId: Number(telegramUser.id),
        data: dataResult.body,

        origin: origin,
        renewedAccessToken: renewedToken
    });
}
