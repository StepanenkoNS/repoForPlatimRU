import {ValidateEvent} from './helpers/validate';
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { BotConfigurator } from 'services/Types/Models/BotConfigurator';


async function handler (event:APIGatewayProxyEvent , context: Context):Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = (await ValidateEvent(event)) as APIGatewayProxyResult;
    if (result.statusCode != 200) {
        return result;
    }

    try {
        const body = JSON.parse(event.body!);
        const botId = body.botToken.match(/\d+(?=:)/)[0];
        await BotConfigurator.DeleteBot(botId);
        return ({
            statusCode: 200,
            body: 'Successfully deleted item'
        } as APIGatewayProxyResult); 
    } catch(error){
        console.log(error);
         return ({
                statusCode: 503,
                body: JSON.stringify(error)
            } as APIGatewayProxyResult);          
    }
}




export {handler};