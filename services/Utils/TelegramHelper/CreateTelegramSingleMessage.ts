
//@ts-ignore
import { EPaymentTypes, ESupportedCurrency, PaymentOption, PaymentOptionDirectCardTransfer, PaymentOptionPaymentIntegration } from "/opt/PaymentTypes";
//@ts-ignore
import { IBotBasicMessages, IBotConfiguration } from "/opt/ConfiguratorTypes";
import { BotGroupRoles, EBotGroupRoles } from "/opt/TelegramTypes";

interface LooseObject {
    [key: string]: any
}
export async function CreateTelegramSingleMessage(chatId: string, botToken:string,  incomingMessage:GenericEnqueueAsyncSendMessage) {
    let messageObject : LooseObject = {
        chat_id: chatId,
        botId: incomingMessage.botId,
        method: incomingMessage.method,
        sender: incomingMessage.sender,
        botToken: botToken
    }

    if (incomingMessage.reply_to_message_id && incomingMessage.reply_to_message_id !== undefined){
        messageObject.reply_to_message_id = incomingMessage.reply_to_message_id; 
    } 
    if (incomingMessage.reply_markup && incomingMessage.reply_markup !== undefined){
        messageObject.reply_markup = incomingMessage.reply_markup; 
    } 

    switch (incomingMessage.method){
        case (TelegramSendMethods.sendMessage) :{
            messageObject.text = (incomingMessage as EnqueueAsyncSendMessage).text;
            //messageObject.parse_mode = (incomingMessage as EnqueueAsyncSendMessage).parse_mode;
            messageObject.parse_mode = 'HTML';
            messageObject.disable_web_page_preview = false;
            //messageObject.disable_web_page_preview = (incomingMessage as EnqueueAsyncSendMessage).disable_web_page_preview;
            //messageObject.messageAttachment = (incomingMessage as EnqueueAsyncSendMessage).messageAttachment;
            break;
        }
        case (TelegramSendMethods.sendPhoto) :{
            messageObject.photo = (incomingMessage as EnqueueAsyncSendPhoto).photo;
            messageObject.caption = (incomingMessage as EnqueueAsyncSendPhoto).caption;
            break;
        } 
        case (TelegramSendMethods.sendAudio) :{
            messageObject.audio = (incomingMessage as EnqueueAsyncSendAudio).audio;
            messageObject.caption = (incomingMessage as EnqueueAsyncSendAudio).caption;
            break;
        } 
        case (TelegramSendMethods.sendDocument) :{
            messageObject.document = (incomingMessage as EnqueueAsyncSendDocument).document;
            messageObject.caption = (incomingMessage as EnqueueAsyncSendDocument).caption;
            break;
        }   
        case (TelegramSendMethods.sendVideo) :{
            messageObject.video = (incomingMessage as EnqueueAsyncSendVideo).video;
            messageObject.caption = (incomingMessage as EnqueueAsyncSendVideo).caption;
            break;
        }         
        case (TelegramSendMethods.sendVoice) :{
            messageObject.voice = (incomingMessage as EnqueueAsyncSendVoice).voice;
            messageObject.caption = (incomingMessage as EnqueueAsyncSendVoice).caption;
            break;
        }     
        case (TelegramSendMethods.sendVideoNote) :{
            messageObject.video_note = (incomingMessage as EnqueueAsyncSendVideoNote).video_note;
            messageObject.caption = (incomingMessage as EnqueueAsyncSendVideoNote).caption;
            break;
        }         
        case (TelegramSendMethods.sendLocation) :{
            messageObject.longitude = (incomingMessage as EnqueueAsyncSendLocation).longitude;
            messageObject.latitude = (incomingMessage as EnqueueAsyncSendLocation).latitude;
            break;
        }         
    }


    return (messageObject as GenericProcessAsyncSendMessage);
    
}