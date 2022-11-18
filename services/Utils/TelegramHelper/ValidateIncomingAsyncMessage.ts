import { TelegramSendMethods } from "../../Types/Telegram/TelegramMethods";

interface LooseObject {
    [key: string]: any
}
export async function ValidateIncomingAsyncMessage(incomingMessage: LooseObject) {
    try{
        if (!Object.hasOwn(incomingMessage, 'botId')) {
            throw ('Message validation error: botId is not provided');
        }

        if (!Object.hasOwn(incomingMessage, 'sender')) {
            throw ('Message validation error: sender is not provided');
        }

        if (!Object.hasOwn(incomingMessage, 'chatIds')) {
            throw ('Message validation error: chatIds is not provided');
        }
        
        if (!Object.hasOwn(incomingMessage, 'method')) {
            throw ('Message validation error: method is not provided');
        }

        
        
        if (!((<any>Object).values(TelegramSendMethods).includes(incomingMessage.method))) {
            throw ('Message validation error: method is incorrect');
        }

        if (Object.hasOwn(incomingMessage, 'caption') && 
        (incomingMessage.caption as string).length>200
        ) { throw ('Message validation error: caption is too long');}

        switch (incomingMessage.method){
            case (TelegramSendMethods.sendMessage) :{
                if (!Object.hasOwn(incomingMessage, 'text')) {
                    throw ('Message validation error: text is not provided');
                }
                if ((incomingMessage.text as string).length>4096)  {
                    throw ('Message validation error: text is too long');
                }
                break;
            }
            case (TelegramSendMethods.sendPhoto) :{
                if (!Object.hasOwn(incomingMessage, 'photo')) {
                    throw ('Message validation error: photo is not provided');}
            
                break;
            } 
            case (TelegramSendMethods.sendAudio) :{
                if (!Object.hasOwn(incomingMessage, 'audio')) {
                    throw ('Message validation error: audio is not provided');}
                break
            } 
            case (TelegramSendMethods.sendDocument) :{
                if (!Object.hasOwn(incomingMessage, 'document')) {
                    throw ('Message validation error: document is not provided');}
                break;
            }   
            case (TelegramSendMethods.sendVideo) :{

                if (!Object.hasOwn(incomingMessage, 'video')) {
                    throw ('Message validation error: video is not provided');}
                break;
            }         
            case (TelegramSendMethods.sendVoice) :{
                if (!Object.hasOwn(incomingMessage, 'voice')) {
                    throw ('Message validation error: voice is not provided');}
                break;
            }     
            case (TelegramSendMethods.sendVideoNote) :{
                if (!Object.hasOwn(incomingMessage, 'video_note')) {
                    throw ('Message validation error: video_note is not provided');}
                break;
            }         
            case (TelegramSendMethods.sendLocation) :{
                if (!Object.hasOwn(incomingMessage, 'longitude')) {
                    throw ('Message validation error: longitude is not provided');}   
                if (!Object.hasOwn(incomingMessage, 'latitude')) {
                    throw ('Message validation error: latitude is not provided');}  

                break;
            }         
        }
        return true;
    }catch(error){
        console.log(error);
        throw(error);
    }
    
}