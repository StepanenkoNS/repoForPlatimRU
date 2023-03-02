import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ParseListItemsResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateStringParameters } from 'services/Utils/ValidateIncomingData';

//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';

export async function ListMessageFilesHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    let tags: string[] = [];
    if (ValidateStringParameters(event, ['tags', 'BOTUUID'])) {
        tags = event.queryStringParameters!.tags!.split(',');
    }

    const result = await ContentConfigurator.ListMyMessageFiles(telegramUser.id, event.queryStringParameters!.BOTUUID!, tags);

    const listResults = ParseListItemsResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
