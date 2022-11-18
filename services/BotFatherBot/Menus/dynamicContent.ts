import * as i18n from "/opt/i18n";
import {SharedButtonMethods} from "./helpers/sharedMethods";

import { Menu, MenuOptions, MenuRange } from '@grammyjs/menu';
import { PayloadHelper } from "./helpers/payloadHelper";
import { ParentTitles } from "./helpers/parentTitles";
import { DynamicContentTitles } from "./helpers/dynamicContentTitles";
import { MyContext } from "/opt/TelegramTypes";



export class DynamicContentMenu extends Menu<MyContext>{
   
    private async pressComposeNewPost(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const replyArray:string[] = [];
        replyArray.push(i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.composeNewPost.msgStartComposing", {
            ns:'botManagerMenu',
            finishWord: i18n.finishWord()}));
        replyArray.push(i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.composeNewPost.msgReactions", {
                ns:'botManagerMenu'}));  
        replyArray.push(i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.composeNewPost.msgLimits", {
                ns:'botManagerMenu'}));                      
        replyArray.push(i18n.cancelPS())

        ctx.session.composeNewDynamicPost = {
            botId: payload.botId!,
            message: replyArray
        }
        await ctx.conversation.enter("bound ComposeNewDynamicPost", {overwrite: true});
    }  

    constructor(id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        //Верхнее меню динамического контента
        this
            .text( {text: DynamicContentTitles.composeNewPostButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload.bind(this)},
                this.pressComposeNewPost.bind(this)).row()
                //DynamicContentTitles.composeNewPostTitle.bind(this)).row() 
                                                                      
            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this) },
                ParentTitles.MenuTitleBotOptions.bind(this));


                // //статической подменю действий над группой
                // const sendActions =  new Menu<MyContext>("sndA", { onMenuOutdated: "Updated, try now." });
                // sendActions
                //     .text( {text: 'Отправить текст', 
                //         payload: SharedButtonMethods.ReturnPayload.bind(this)}).row()
                //     .text( {text: 'Отправить видео', 
                //         payload: SharedButtonMethods.ReturnPayload.bind(this)}).row()                        
                //     .back({text: SharedButtonMethods.backMenuButton.bind(this),
                //          payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this) 
                //         }, DynamicContentTitles.MainMenuTitle.bind(this));                    
                // this.register(sendActions);                
    }
}