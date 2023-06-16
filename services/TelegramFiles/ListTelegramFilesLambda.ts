import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { FileTelegramConfigurator } from '/opt/FileTelegramConfigurator';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let tags: string[] = [];

    if (!ValidateStringParameters(event, ['botId'])) {
        return await ReturnRestApiResult({
            statusCode: 422,
            method: 'LIST',
            masterId: Number(telegramUser.id),
            data: { success: false, error: 'QueryString parameters are invald' },
            withMapReplacer: false,
            origin: origin,
            renewedAccessToken: renewedToken
        });
    }

    if (ValidateStringParameters(event, ['tags'])) {
        if (event.queryStringParameters!.tags! !== '') {
            tags = event.queryStringParameters!.tags!.split(',');
        }
    }

    const result = await FileTelegramConfigurator.ListMyTelegramFiles(
        {
            masterId: telegramUser.id,
            botId: Number(TextHelper.SanitizeToDirectText(event.queryStringParameters!.botId!))
        },
        tags
    );

    const dataResult = ParseListResult(result);

    return await ReturnRestApiResult({
        statusCode: dataResult.code,
        method: 'LIST',
        masterId: Number(telegramUser.id),
        data: dataResult.body,
        withMapReplacer: false,
        origin: origin,
        renewedAccessToken: renewedToken
    });
}
