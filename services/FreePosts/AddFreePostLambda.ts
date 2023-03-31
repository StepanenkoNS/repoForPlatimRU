import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

//@ts-ignore
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingEventBody, ValidateStringParameters } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseGetItemResult, ParseInsertItemResult, ParseListItemsResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
//@ts-ignore
import ContentConfigurator from '/opt/ContentConfigurator';
//@ts-ignore

export async function AddFreePostHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(positiveInteger)' },
        { key: 'sendMethod', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'message', datatype: 'object', objectKeys: [] },
        { key: 'trigger', datatype: 'object', objectKeys: [] },
        { key: 'interaction', datatype: 'object', objectKeys: [] }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    const result = await ContentConfigurator.AddFreePost({
        botId: bodyObject.botId,
        masterId: telegramUser.id,
        discriminator: 'IFreePost',

        sendMethod: bodyObject.sendMethod,
        name: bodyObject.name,

        message: bodyObject.message,
        trigger: bodyObject.trigger,
        interaction: bodyObject.interaction
    });

    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
