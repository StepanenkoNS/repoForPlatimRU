import {GenericEnqueueAsyncSendMessage} from '../../Types/Telegram/EnqueueSendMessageTypes';

export function DecodeTextURI(msg: GenericEnqueueAsyncSendMessage){
    let decodedMessage = msg;
    if (('caption' in decodedMessage ) && (decodedMessage.caption)) {
        if (decodedMessage.caption !== decodeURI(decodedMessage.caption)){
            decodedMessage.caption = decodeURI(decodedMessage.caption);
        }
    }
    if (('text' in decodedMessage ) && (decodedMessage.text)) {
        if (decodedMessage.text !== decodeURI(decodedMessage.text)){
            decodedMessage.text = decodeURI(decodedMessage.text);
        }
    } 
    return decodedMessage;

}