import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { enqueueTelegramBotEvent } from './Helpers/sqs';

    
async function queueIncomingTelegramBotEvents (event:APIGatewayProxyEvent , context: Context):Promise<APIGatewayProxyResult> {
    let body:any;
    if (!event) {
        const err = 'Error: event is not defined';
        console.log(err);
        return ({
            statusCode: 503,
            body: JSON.stringify(err),
            headers: {
                "Content-Type": "application/json"
            }
        }as APIGatewayProxyResult) 
    }
    if (!event.pathParameters || !event.pathParameters.proxy) {
        const err = 'Error: pathParameters or pathParameters.proxy are empty ';
        console.log(err);
        return ({
            statusCode: 503,
            body: JSON.stringify(err),
            headers: {
                "Content-Type": "application/json"
            }
        }as APIGatewayProxyResult) 
    }    
    if (!event.pathParameters.proxy.match(/[0-9]+/) ) {
        const err = 'Error: bot not found in the event';
        console.log(err);
        return ({
            statusCode: 503,
            body: JSON.stringify(err),
            headers: {
                "Content-Type": "application/json"
            }
        } as APIGatewayProxyResult) 
    }    

    try {
        body = JSON.parse(event.body!);
        console.log(body);
    } catch (error){
        const err = 'Error: mailformed body - invalid JSON object';
        console.log(err);
        return ({
            statusCode: 503,
            body: JSON.stringify(err),
            headers: {
                "Content-Type": "application/json"
            }
        } as APIGatewayProxyResult)          
    }

    try {
        // const incomingBotId = event.pathParameters.proxy;
        // const botFatherId = incomingBotId.match(/[0-9]+/)![0];

        let bodyMessage: any;
        if (body.message) {
            bodyMessage = body.message;
        } else {
            if (body.callback_query){
                bodyMessage = body.callback_query;
            }
        }
        
        const chatId = bodyMessage.from.id;
        const userName = bodyMessage.from.username;
        let menuLanguage = bodyMessage.from.language_code;

        //if (botFatherId === undefined) {throw ('botFather Id not defined')};
        if (chatId === undefined) {throw ('ChatId is not defined')};
        const systemParams =  {
            systemParameters: {
                //botFatherId: botFatherId,
                chatId: chatId.toString(),
                userName: userName,
                menuLanguage: menuLanguage
            }
        } 
        const messageToSend =  {...systemParams, ...body};
        console.log(JSON.stringify(messageToSend));
        await enqueueTelegramBotEvent(messageToSend);


        return ({
            statusCode: 200,
            body: JSON.stringify({Result: 'Success'}),
            headers: {
                "Content-Type": "application/json"
            }
        } as APIGatewayProxyResult);

        } catch (error) {
            console.log('Error', JSON.stringify(error));
            return ({
                statusCode: 503,
                body: JSON.stringify(error),
                headers: {
                    "Content-Type": "application/json"
                }
            } as APIGatewayProxyResult);            
        }
}

export {queueIncomingTelegramBotEvents};