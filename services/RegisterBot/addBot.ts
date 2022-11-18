

import {ValidateEvent} from './helpers/validate';
import {APIGatewayProxyEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import { BotConfigurator } from 'services/Types/Models/BotConfigurator';



async function handler (event:APIGatewayProxyEvent , context: Context):Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = (await ValidateEvent(event)) as APIGatewayProxyResult;
    if (result.statusCode != 200) {
        return result;
    }
    const body = JSON.parse(event.body!);
    const botId = body.botToken.match(/\d+(?=:)/)[0];
    console.log('Registration request received for botId:  ', botId)
    const botToken = body.botToken;
    console.log(botToken)
    try {
        await BotConfigurator.CreateNewBot({
            botId: botId,
            admin: body.admin,
            active: true
        }, botToken);
        return ({
              statusCode: 200,
              body: JSON.stringify('Bot token created')
            } as APIGatewayProxyResult);            
    } catch (error) {
        console.log('error:', error);
        return ({
            statusCode: 501,
            body: JSON.stringify(error)
        } as APIGatewayProxyResult);
    }


}


export {handler};