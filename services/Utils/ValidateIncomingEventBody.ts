import { APIGatewayEvent } from 'aws-lambda';
import ReturnRestApiResult from './ReturnRestApiResult';

export function ValidateIncomingEventBody(event: APIGatewayEvent, params: string[]) {
    let bodyObject: any;

    if (!event.body) {
        return false;
    }
    try {
        bodyObject = JSON.parse(event.body);
    } catch (error) {
        return false;
    }
    for (const param of params) {
        if (!bodyObject.hasOwnProperty(param)) {
            return false;
        }
    }

    return bodyObject;
}
