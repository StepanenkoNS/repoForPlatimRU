import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import CryptoJS from 'crypto-js';

//@ts-ignore
import { ReturnBlankApiResult } from '/opt/LambdaHelpers/ReturnRestApiResult';

export async function handler(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    try {
        console.log('event', JSON.stringify(event));

        const queryString = event.body ? event.body : '';
        const params = new URLSearchParams(queryString);

        const notififation = Object.fromEntries(params.entries()) as any;
        console.log(notififation);

        return ReturnBlankApiResult(200, { success: true }, '');
    } catch (error) {
        console.log(error);
        return ReturnBlankApiResult(503, { success: true }, '');
    }
}
