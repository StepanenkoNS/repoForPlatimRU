import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
//@ts-ignore
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore
import { ValidateIncomingArray, ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
//@ts-ignore
import { ParseInsertItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
//@ts-ignore
import { BotSubscriptionConfigurator } from '/opt/BotSubscriptionConfigurator';
import { ESubscriptionDurationName } from '/opt/SubscriptionTypes';

export async function AddServiceSubscriptionPlanHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
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
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { error: bodyObject.error }, false, origin, renewedToken);
    }

    if (bodyObject.data.durationType === ESubscriptionDurationName.DAYS) {
        let arrayValidationResult = ValidateIncomingArray(bodyObject.data.options, [
            { key: 'id', datatype: 'string' },
            { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'name', datatype: 'string' },
            { key: 'durationInDays', datatype: 'number(positiveInteger)' },
            { key: 'price', datatype: 'number(nonZeroPositive)' },
            { key: 'enabled', datatype: 'boolean' }
        ]);
        if (arrayValidationResult === false) {
            return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed options - DAYS array' }, false, origin, renewedToken);
        }
    }

    if (bodyObject.data.durationType === ESubscriptionDurationName.DATES) {
        let arrayValidationResult = ValidateIncomingArray(bodyObject.data.options, [
            { key: 'id', datatype: 'string' },
            { key: 'orderN', datatype: 'number(nonZeroPositiveInteger)' },
            { key: 'name', datatype: 'string' },
            { key: 'dateStart', datatype: 'date' },
            { key: 'dateFinish', datatype: 'date' },
            { key: 'price', datatype: 'number(nonZeroPositive)' },
            { key: 'enabled', datatype: 'boolean' }
        ]);
        if (arrayValidationResult === false) {
            return ReturnRestApiResult(422, { success: false, error: 'Error: mailformed options - DATES array' }, false, origin, renewedToken);
        }
    }

    const result = await BotSubscriptionConfigurator.AddSubscriptionPlan({
        chatId: Number(telegramUser.id),
        durationType: bodyObject.data.durationType,
        name: bodyObject.data.name,
        enabled: bodyObject.data.enabled,
        options: bodyObject.data.options
    });
    const addResult = ParseInsertItemResult(result);

    return ReturnRestApiResult(addResult.code, addResult.body, false, origin, renewedToken);
}
