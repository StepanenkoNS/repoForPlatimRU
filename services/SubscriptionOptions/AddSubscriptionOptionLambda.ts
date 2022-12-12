import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import ReturnRestApiResult from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingArray, ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';
import { ESubscriptionType } from '/opt/SubscriptionTypes';

export async function AddSubscriptionOptionHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'name', datatype: 'string' },
        { key: 'type', datatype: ['MARATHON', 'INTERACTIVE_COURSE', 'SCHEDULED_COURSE'] },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'options', datatype: 'array' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }
    //todo - validate rows
    if (bodyObject.type === ESubscriptionType.MARATHON) {
        ValidateIncomingArray(bodyObject.options, [
            { key: 'id', datatype: 'string' },
            { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'name', datatype: 'string' },
            { key: 'dateStart', datatype: 'date' },
            { key: 'dateFinish', datatype: 'date' },
            { key: 'price', datatype: 'number(nonZeroPositive)' },
            { key: 'enabled', datatype: 'boolean' }
        ]);
    }

    if (bodyObject.type === ESubscriptionType.INTERACTIVE_COURSE || bodyObject.type === ESubscriptionType.SCHEDULED_COURSE) {
        ValidateIncomingArray(bodyObject.options, [
            { key: 'id', datatype: 'string' },
            { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'name', datatype: 'string' },
            { key: 'lengthInDays', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'price', datatype: 'number(nonZeroPositive)' },
            { key: 'enabled', datatype: 'boolean' }
        ]);
    }
    try {
        await BotSubscriptionConfigurator.AddSubscriptionPlan({
            chatId: telegramUser.id,
            enabled: bodyObject.enabled,
            subscriptionName: bodyObject.name,
            subscriptionType: bodyObject.type,
            options: bodyObject.options
        });

        const returnObject = ReturnRestApiResult(200, { success: true }, false, origin, renewedToken);
        console.log(returnObject);
        return returnObject;
    } catch (error) {
        return ReturnRestApiResult(500, { error: 'Internal server error' }, false, origin, renewedToken);
    }
}
