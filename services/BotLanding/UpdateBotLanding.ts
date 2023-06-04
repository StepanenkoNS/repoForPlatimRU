import { TextHelper } from '/opt/TextHelpers/textHelper';
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { ParseItemResult, ReturnRestApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';
import { defaultMenuLanguage, ESupportedLanguage } from '/opt/LocaleTypes';
import { SetOrigin } from '/opt/LambdaHelpers/OriginHelper';
//@ts-ignore

import { ValidateIncomingEventBody } from '/opt/LambdaHelpers/ValidateIncomingData';
import { TelegramUserFromAuthorizer } from '/opt/AuthTypes';
import { BotLanging } from '/opt/BotLanding';
import {
    BotLandingElementType,
    EBotLangingElementType,
    IBotLanding,
    IBotLandingElementFooter,
    IBotLandingElementHeader,
    IBotLandingElementImage,
    IBotLandingElementTelegramButton,
    IBotLandingElementText,
    IBotLandingElementYouTubeVideo
} from '/opt/BotLandingTypes';
//@ts-ignore
import { SchemaValidator } from '/opt/YUP/SchemaValidator';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    console.log(JSON.stringify(event));
    const origin = SetOrigin(event);
    console.log('origin', origin);
    const telegramUser = event.requestContext.authorizer as TelegramUserFromAuthorizer;
    let renewedToken = undefined;

    if (event?.requestContext?.authorizer?.renewedAccessToken) {
        renewedToken = event.requestContext.authorizer.renewedAccessToken as string;
    }
    let bodyObject = ValidateIncomingEventBody(event, [
        { key: 'botId', datatype: 'number(nonZeroPositiveInteger)' },
        { key: 'subdomain', datatype: 'string' },
        { key: 'title', datatype: 'string' },
        { key: 'elements', datatype: 'array' }
    ]);
    if (bodyObject.success === false) {
        return ReturnRestApiResult(422, { success: false, error: bodyObject.error }, false, origin, renewedToken);
    }

    const potentialBotLanding: IBotLanding = {
        masterId: Number(telegramUser.id),
        botId: Number(TextHelper.SanitizeToDirectText(bodyObject.data.botId)),
        title: TextHelper.SanitizeToDirectText(bodyObject.data.title),
        elements: (bodyObject.data.elements as BotLandingElementType[]).map((value) => {
            switch (value.type) {
                case EBotLangingElementType.FOOTER: {
                    const element: IBotLandingElementFooter = {
                        text: TextHelper.RemoveUnsupportedHTMLTags(value.text),
                        type: EBotLangingElementType.FOOTER
                    };
                    return element;
                }
                case EBotLangingElementType.HEADER: {
                    const element: IBotLandingElementHeader = {
                        text: TextHelper.RemoveUnsupportedHTMLTags(value.text),
                        type: EBotLangingElementType.HEADER
                    };
                    return element;
                }
                case EBotLangingElementType.IMAGE: {
                    const element: IBotLandingElementImage = {
                        type: EBotLangingElementType.IMAGE,
                        link: TextHelper.SanitizeToDirectText(value.link),
                        height: Number(TextHelper.SanitizeToDirectText(value.height)),
                        width: Number(TextHelper.SanitizeToDirectText(value.width))
                    };
                    return element;
                }
                case EBotLangingElementType.TELEGRAMBUTTON: {
                    const element: IBotLandingElementTelegramButton = {
                        text: TextHelper.RemoveUnsupportedHTMLTags(value.text),
                        type: EBotLangingElementType.TELEGRAMBUTTON
                    };
                    return element;
                }
                case EBotLangingElementType.TEXT: {
                    const element: IBotLandingElementText = {
                        text: TextHelper.RemoveUnsupportedHTMLTags(value.text),
                        type: EBotLangingElementType.TEXT
                    };
                    return element;
                }
                case EBotLangingElementType.YOUTUBE: {
                    const element: IBotLandingElementYouTubeVideo = {
                        type: EBotLangingElementType.YOUTUBE,
                        video_id: TextHelper.RemoveUnsupportedHTMLTags(value.video_id),
                        height: Number(TextHelper.SanitizeToDirectText(value.height)),
                        width: Number(TextHelper.SanitizeToDirectText(value.width))
                    };
                    return element;
                }
                default: {
                    const element: IBotLandingElementText = {
                        text: 'UNKNOWN ELEMENT',
                        type: EBotLangingElementType.TEXT
                    };
                    return element;
                }
            }
        }),
        subdomain: TextHelper.SanitizeToDirectText(bodyObject.data.subdomain)
    };

    const schemaValidationResult = await SchemaValidator.BotLanding_Validator(potentialBotLanding);
    if (schemaValidationResult.success == false || !schemaValidationResult.item) {
        return ReturnRestApiResult(422, { error: schemaValidationResult.error }, false, origin, renewedToken);
    }

    const result = await BotLanging.UpdateBotLanging(schemaValidationResult.item as any);

    const updateResult = ParseItemResult(result);

    return ReturnRestApiResult(updateResult.code, updateResult.body, false, origin, renewedToken);
}
