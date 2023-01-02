import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { SetOrigin } from 'services/Utils/OriginHelper';
import { ParseListItemsResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { ValidateStringParameters } from 'services/Utils/ValidateIncomingData';

//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';

export async function ListContentPlanPostsHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }

    if (!ValidateStringParameters(event, ['contentPlanId'])) {
        return ReturnRestApiResult(422, { error: 'QueryString parameters are invald' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.ListMyContentPlanPosts(telegramUser.id, event.queryStringParameters!.contentPlanId!);

    const listResults = ParseListItemsResult(result);

    return ReturnRestApiResult(listResults.code, listResults.body, false, origin, renewedToken);
}
