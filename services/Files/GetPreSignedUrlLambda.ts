import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseGetItemResult, ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import { S3Helper } from '/opt/S3/S3Utils';
//@ts-ignore
import BotManager from '/opt/BotManager';

export async function GetPreSignedUrlHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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

    if (bodyObject === false) {
        return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const botManager = await BotManager.GetOrCreate({
        masterId: telegramUser.id,
        userName: telegramUser.username
    });

    console.log('botManager', botManager);
    const validateLimits = botManager.CheckSubscriptionsLimits({
        resourceConsumption_mediaFiles: bodyObject.fileSize
    });
    console.log('validateLimits', validateLimits);

    if (validateLimits) {
        const s3Result = await S3Helper.GeneratePreSignedURL_Put(process.env.tempUploadsBucketName!, telegramUser.id, bodyObject.botId, bodyObject.fileName, bodyObject.fileType, 1);
        console.log(s3Result);

        const getResult = ParseGetItemResult(s3Result);

        console.log('getResult', getResult);

        return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
    } else {
        const getResult = ParseGetItemResult(undefined);

        return ReturnRestApiResult(getResult.code, getResult.body, false, origin, renewedToken);
    }
}
