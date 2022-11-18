import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import axios from 'axios';


async function handler (event:APIGatewayProxyEvent , context: Context):Promise<APIGatewayProxyResult> {
    console.log('inside handler');
    if (event.queryStringParameters && ('botToken' in event.queryStringParameters) ) {
        const keyValue = event.queryStringParameters['botToken'!];
        const registrationUrl = 
        'https://api.telegram.org/bot'
        +keyValue
        +'/getMe';

    //console.log(registrationUrl);
    const response = await axios.get(registrationUrl);
    const returnText = response.data ? response.data : '';
    //console.log(response);

        return ({
            statusCode: 200,
            body: JSON.stringify(returnText)
        } as APIGatewayProxyResult); 
    } else {
        return ({
            statusCode: 503,
            body: 'bot token not provided or invalid'
        } as APIGatewayProxyResult);         
    }

}


export {handler};