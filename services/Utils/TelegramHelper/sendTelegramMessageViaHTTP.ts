import axios from "axios";
import { GenericProcessAsyncSendMessage } from "../../Types/Telegram/ProcessSendMessageTypes";

interface LooseObject {
    [key: string]: any
}

export async function httpReplyWithTextMessageAndLog(msg: any ){
    try{


        const sendMessageURL = 
            'https://api.telegram.org/bot'
            + msg.botToken
            + '/'+msg.method;
        console.log('URL: \n',sendMessageURL);
        const response = await axios.post(sendMessageURL, msg);
        
        console.log('responce from TG: ', response);

     return response; 
    } catch (error){
        console.log('ErrorInHandler --->\n',error);
        return undefined;
    }  
}