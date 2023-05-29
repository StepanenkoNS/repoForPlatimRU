import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

import { FileS3Configurator } from '/opt/FileS3Configurator';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let tags: string[] = [];
    if (ValidateStringParameters(event, ['tags', 'botId'])) {
        tags = event.queryStringParameters!.tags!.split(',');
    }

    const result = await FileS3Configurator.ListMyMessageFiles(
        {
            masterId: Number(telegramUser.id),
            botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!))
        },
        tags
    );

    const listResults = ParseListResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
