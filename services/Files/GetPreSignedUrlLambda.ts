import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { S3Helper } from '/opt/S3/S3Utils';

export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
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
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
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

    const getResult = ParseItemResult(s3Result);

    console.log('getResult', getResult);

    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
