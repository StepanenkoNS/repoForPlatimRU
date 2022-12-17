import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseInsertItemResult, ReturnRestApiResult } from 'services/Utils/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from 'services/Utils/Types';
import { ValidateIncomingArray, ValidateIncomingEventBody } from 'services/Utils/ValidateIncomingData';

import { SetOrigin } from '../Utils/OriginHelper';
//@ts-ignore
import BotSubscriptionConfigurator from '/opt/BotSubscriptionConfigurator';
import { ESubscriptionDurationName } from '/opt/SubscriptionTypes';

export async function AddSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    console.log(event);

    const origin = SetOrigin(event);

    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'name', datatype: 'string' },
        { key: 'name', datatype: 'string' },
        { key: 'durationType', datatype: [ESubscriptionDurationName.DAYS, ESubscriptionDurationName.DATES] },
        { key: 'enabled', datatype: 'boolean' },
        { key: 'options', datatype: 'array' }
    ]);
    if (bodyObject === false) {
        return ReturnRestApiResult(422, { error: 'Error: mailformed JSON body' }, false, origin, renewedToken);
    }

    if (bodyObject.durationType === ESubscriptionDurationName.DAYS) {
        let arrayValidationResult = ValidateIncomingArray(bodyObject.options, [
            { key: 'id', datatype: 'string' },
            { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'name', datatype: 'string' },
            {
                key: 'durationType',
                datatype: 'object',
                objectKeys: [
                    {
                        key: 'durationInDays',
                        datatype: 'number(positiveInteger)'
                    }
                ]
            },
            { key: 'price', datatype: 'number(nonZeroPositive)' },
            { key: 'enabled', datatype: 'boolean' }
        ]);
        if (arrayValidationResult === false) {
            return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed options - DAYS array' }, false, origin, renewedToken);
        }
    }

    if (bodyObject.durationType === ESubscriptionDurationName.DATES) {
        let arrayValidationResult = ValidateIncomingArray(bodyObject.options, [
            { key: 'id', datatype: 'string' },
            { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'name', datatype: 'string' },
            {
                key: 'durationType',
                datatype: 'object',
                objectKeys: [
                    {
                        key: 'dateStart',
                        datatype: 'date'
                    },
                    {
                        key: 'dateFinish',
                        datatype: 'date'
                    }
                ]
            },
            { key: 'price', datatype: 'number(nonZeroPositive)' },
            { key: 'enabled', datatype: 'boolean' }
        ]);
        if (arrayValidationResult === false) {
            return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed options - DATES array' }, false, origin, renewedToken);
        }
    }

    const result = await BotSubscriptionConfigurator.AddSubscriptionPlan({
        chatId: telegramUser.id,
        durationType: bodyObject.durationType,
        name: bodyObject.name,
        enabled: bodyObject.enabled,
        options: bodyObject.options
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
