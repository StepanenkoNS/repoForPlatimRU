import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ParseGetItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateIncomingEventBody, ValidateStringParameters } from 'services/Utils/ValidateIncomingData';
//@ts-ignore
import { S3Helper } from '/opt/S3/S3Utils';

export async function GetPreSignedUrlHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'fileName', datatype: 'string' },
        { key: 'fileType', datatype: 'string' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const s3Result = await S3Helper.GeneratePreSignedURL_Put(process.env.tempUploadsBucketName!, telegramUser.id, bodyObject.fileName, bodyObject.fileType, 1);
    console.log(s3Result);

    const getResult = ParseGetItemResult(s3Result);

    return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
}
