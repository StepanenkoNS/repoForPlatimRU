import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ParseListItemsResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { ValidateStringParameters } from 'services/Utils/ValidateIncomingData';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';

//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';

export async function ListContentPlansHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['BOTUUID'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.ListMyBotContentPlans(telegramUser.id, event.queryStringParameters!.BOTUUID!);

    const listResults = ParseListItemsResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
