// @ts-ignore: Unreachable code error
import * as i18n from "/opt/i18n";

import { BotManager } from "../../Types/Models/BotManager";
import { DynamicContentTitles } from "../Menus/helpers/dynamicContentTitles";
//@ts-ignore
import * as TelegramTypes from "/opt/TelegramTypes";
import { MessageToBotTeamHeader, MyContext, MyConversation } from "/opt/TelegramTypes";
//@ts-ignore
import * as ConversationMenuRoutine  from "/opt/ConversationMenuRoutine";
import * as ComposePost  from "/opt/ComposePost";



export class DynamicBotConversations{
    private botManager: BotManager;

    constructor(botManager: BotManager, parent: any){
        this.botManager = botManager;
    }


    public async ComposeNewDynamicPost(conversation: MyConversation, ctx: MyContext){
        const messagesForDeletion: number[] = [];
        let postMessages: TelegramTypes.GenericPostMessage[] = [];

        if (!ctx.session.composeNewDynamicPost || !ctx.session.composeNewDynamicPost.botId || !ctx.session.composeNewDynamicPost.message){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;   
        }

        for (const msg of ctx.session.composeNewDynamicPost.message){
            const introMsg = await ctx.reply(msg, {parse_mode: 'HTML'});
            messagesForDeletion.push(introMsg.message_id);
        }

        let flag = true;

        while (flag){
            const result = await conversation.wait();
            if (result.msg) {
                messagesForDeletion.push(result.msg.message_id);
            }

            const checkedMessage = await ConversationMenuRoutine.CheckMessage(result,messagesForDeletion);
            switch (checkedMessage.action){
                case "cancel": {
                    let menuText = await DynamicContentTitles.composeNewPostTitleText(ctx) ;
                    await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);                    
                    return;
                }
                case "finish": {
                    flag = false;
                    break;
                }
            }
            const fileSizeValidationResult = ConversationMenuRoutine.ValidateMessageFileSize(result);
            if (fileSizeValidationResult.result == "exceedsTheLimit"){
                const replyText = i18n.getTranslation("basicMessages.fileExceedTheLimit",{
                    ns:"translation",
                    fileType: fileSizeValidationResult.fileType,
                    limitSize: fileSizeValidationResult.limitSize,
                    actualSize: Math.round(fileSizeValidationResult.actualSize! * 10) /10
                });
                await result.reply(replyText,{parse_mode:"HTML"});
                let menuText = await DynamicContentTitles.composeNewPostTitleText(ctx) ;
                await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);                    
                return;                
            }
            if (checkedMessage.message){
                postMessages.push(checkedMessage.message);
            }
        }

        const header: MessageToBotTeamHeader = {
            sender: {
                botId: "botFather",
                chatId: ctx.update.callback_query!.from.id.toString(),
                templateVisibilityBotId: ctx.session.composeNewDynamicPost.botId
            },

        }
        console.log(JSON.stringify(postMessages));
        await ComposePost.QueueCreatePostTemplate(header, postMessages)


        //await this.botManager.RegisterNewBot(match[0]);
        let menuText = await DynamicContentTitles.composeNewPostTitleText(ctx) ;

        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);

    }

  

}

