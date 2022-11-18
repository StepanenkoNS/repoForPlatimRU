import axios from "axios";
import { Keyboard} from "grammy";
//@ts-ignore
import {  MyContext, MyConversation } from "/opt/TelegramTypes";

const keyboardYesNo = new Keyboard()
    .text("Yes").row()
    .text("No").row()
    .resized();
    
export class ConversationHelper{
    private conversation: MyConversation;
    private ctx: MyContext;

    public static async GetFilePathURL(botToken: string, fileId:string){
        try{
        const URL = 'https://api.telegram.org/bot'
        +botToken
        +'/getFile?file_id='
        +fileId;   

        const response = await axios.get(URL);
        console.log('responce from TG: ', response);

        const retURL = 'https://api.telegram.org/file/bot'
        +botToken
        +'/'
        +response.data.result.file_path;
        return retURL
        } catch (error){
            console.log(error);
            return '';
        }
    }


    public GetChatIdFromConversation(){
        let body : any ;
        if (this.ctx.update.message) {
            console.log('using body.message');
            body = this.ctx.update.message;
        } else {
            if (this.ctx.update.callback_query){
                console.log('using body.callback_query');
                body = this.ctx.update.callback_query;
            }
        }
        console.log(body);        
        const chatId = body!.from!.id;    
        return chatId;    
    }

    public static async RequestText(question:string,conversation: MyConversation, ctx: MyContext) {
        if (question!=='') {await ctx.reply(question, {parse_mode:"HTML"});}
        const result = await conversation.form.text();
        if (result !==undefined) {
            return result;
        } else return undefined;
    }

    public static async RequestTextMessage(conversation: MyConversation, ctx: MyContext) {
        const result = await conversation.waitFor(":text");
        if (result !==undefined && result.message !==undefined && result.message.text !==undefined) {
            return {
                messageId: result.message?.message_id,
                messageText: result.message?.text
            }
        } else return undefined;

    }    
    
    public static async RequestNumber(question:string, conversation: MyConversation, ctx: MyContext) {
        await ctx.reply(question, {});
        const { message } = await conversation.wait();
        if (!message || !(message.text)) {
            throw('Empty message');
        }

        const parsed = parseInt(message?.text!);
        if (isNaN(parsed)) { throw('Not a number');}
        return parsed;
    }

    public static async RequestYesNo(question:string, conversation: MyConversation, ctx: MyContext) {
        await ctx.reply(question,  {reply_markup: keyboardYesNo, })
        const { message } = await conversation.wait();
        return message?.text === "Yes";
    }     

    public static async RequestPhotoFile(question:string, conversation: MyConversation, ctx: MyContext ) {
        await ctx.reply(question,{reply_markup: { remove_keyboard: true }});

        const { message } = await conversation.wait();
        if (message){
            if (message.document){
                return message.document.file_id
            }
            if (message.photo){
                return message.photo[message.photo.length-1].file_id
            }
        }
        return undefined;
    }    
    
}