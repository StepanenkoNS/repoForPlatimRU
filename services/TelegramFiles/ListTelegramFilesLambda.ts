import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { FileTelegramConfigurator } from '/opt/FileTelegramConfigurator';

export async function ListTelegramFilesHandler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let tags: string[] = [];

    if (!ValidateStringParameters(event, ['botId'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    if (ValidateStringParameters(event, ['tags'])) {
        tags = event.queryStringParameters!.tags!.split(',');
    }

    const result = await FileTelegramConfigurator.ListMyTelegramFiles(
        {
            masterId: telegramUser.id,
            botId: Number(event.queryStringParameters!.botId!)
        },
        tags
    );

    const listResults = ParseListItemsResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
