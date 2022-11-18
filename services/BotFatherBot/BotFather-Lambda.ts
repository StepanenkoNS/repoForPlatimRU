import {  BotError, GrammyError, HttpError } from "grammy";

import { Update } from "@grammyjs/types";
//@ts-ignore
import * as i18n from "/opt/i18n";
import { TelegramBot } from "../Types/Telegram/TelegramBot";
import { BotManager } from "../Types/Models/BotManager";


export async function botFatherHandler (event:any, _context: any):Promise<any>   {
    let body: any;
    //console.log('\n',event);
    try {
        if (event.Records){
            body = JSON.parse(event.Records[0].body!);
        } else {
            body = JSON.parse(event.body!);
        }    
    } catch (error){
        const err = 'Error: mailformed body - invalid JSON object';
        throw (err);        
    }  


    let botFatherId = process.env.botFatherId!;
    let chatId: string;
    let userName: string
    let menuLanguage:string;   


    if (process.env.NODE_ENV==='production'){

        chatId = body.systemParameters.chatId;
        userName = body.systemParameters.userName;
        menuLanguage = body.menuLanguage
    } else {
        let bodyMessage: any;
        if (body.message) {
            bodyMessage = body.message;
        } else {
            if (body.callback_query){
                bodyMessage = JSON.parse(body.callback_query);
            }
        }        

        chatId = bodyMessage.from.id;
        userName = bodyMessage.from.username;
        menuLanguage = bodyMessage.from.language_code;

        const systemParams =  {
            systemParameters: {
                chatId: chatId.toString(),
                userName: userName,
                menuLanguage: menuLanguage
            }
        } 
        body =  {...systemParams, ...body};        
    }

        const botManager = await BotManager.GetOrCreate({
            chatId:chatId!,
            userName: userName!
        });         

        await i18n.changeLanguage(
            botManager.GetBotManagerMenuLanguage()
        );


        const telegramBot = new TelegramBot(process.env.BOT_FATHER_TOKEN!, botManager, {
            client: {
                apiRoot: process.env.tg_api_serverURI,
                
            }
        } );


        telegramBot.catch( async (err) => {
            const ctx = err.ctx;
            console.error(`Error while handling update ${ctx.update.update_id}:`);
            const e = err.error;
            if (e instanceof GrammyError) {
              console.error("Error in request:", e.description);
              return;
            };
            if (e instanceof HttpError) {
                 console.error("Could not contact Telegram:", e);
                 return;
            } 
            if (err.message == "Error in middleware: You cannot use `ctx.conversation` from within a conversation!"){
                try {
                    const txt = i18n.getTranslation("basicMessages.ctxConversationError",{
                        ns:"translation",
                        cancelWord: i18n.cancelWord()
                    });
                    await ctx.api.sendMessage(chatId, txt, {parse_mode: "HTML"});
                    } catch {

                    }
            }      

              console.error("Unknown error:", e);

        });


        if (process.env.NODE_ENV==='production'){
            const update: Update = (body as Update);
            await telegramBot.init();
            await telegramBot.handleUpdate((update as Update));
        } else {
            telegramBot.start(); 
        } 

    
}


