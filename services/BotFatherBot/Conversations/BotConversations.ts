import {ConversationHelper} from '../../Utils/TelegramHelper/ConversationHelper'
// @ts-ignore: Unreachable code error
import * as i18n from "/opt/i18n";
import { ParentTitles } from "../Menus/helpers/parentTitles";
import { BotManager } from "../../Types/Models/BotManager";
import { BotSubscriptionConfigurator } from "../../Types/Models/BotSubscriptionConfigurator";
import { BotConfigurator } from "../../Types/Models/BotConfigurator";

import * as TelegramTypes from "/opt/TelegramTypes";
import { EBotGroupRoles, MyContext, MyConversation } from '/opt/TelegramTypes';
import { ESubscriptionType } from '/opt/SubscriptionTypes';
import { EPaymentTypes, ESupportedCurrency, PaymentOptionDirectCardTransfer, PaymentOptionPaymentIntegration } from '/opt/PaymentTypes';
import * as ConversationMenuRoutine from '/opt/ConversationMenuRoutine';
//@ts-ignore
import {ConversationValidators} from '/opt/ConversationValidators';

export class BotConversations{
    private botManager: BotManager;

    constructor(botManager: BotManager, parent: any){
        this.botManager = botManager;
    }


    public async AddNewBot(conversation: MyConversation, ctx: MyContext){
        const messagesForDeletion: number[] = [];

        let txt = i18n.getTranslation("mainMenu.bots.addBot.requestMessage",{ns:'botManagerMenu'});
        txt = txt + i18n.cancelPS();
        const introMsg = await ctx.reply(txt, {parse_mode: 'HTML'});
        messagesForDeletion.push(introMsg.message_id);
        let supposedBotToken = await ConversationHelper.RequestTextMessage(conversation,ctx); 
        if (supposedBotToken !== undefined && supposedBotToken.messageText.toLowerCase()===i18n.cancelWord()){
            await ctx.reply(i18n.getTranslation("basicMessages.cancelActionAfterwards",{ns:"translation"})
            ,{parse_mode:"HTML"});  
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion);
            return;
        }
        
        messagesForDeletion.push(supposedBotToken!.messageId);
        const match = supposedBotToken!.messageText.match(/^.+[0-9]?(?=:):[a-zA-Z0-9_-]{35}/);
        if (!match || match == undefined){
            await ctx.reply(i18n.getTranslation("mainMenu.bots.addBot.invalidToken",
            {ns:'botManagerMenu'})
            ,{parse_mode:"HTML"});  
            await ctx.reply(i18n.getTranslation("basicMessages.cancelActionAfterwards",{ns:"translation"})
            ,{parse_mode:"HTML"});  
            return;            
        }
        await this.botManager.RegisterNewBot(match[0]);
        let menuText = await ParentTitles.MenuTitleBotsText(ctx) ;
        
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);

    }

    public async AddSubscriptionPlan(conversation: MyConversation, ctx: MyContext) {

        const messagesForDeletion: number[] = [];
        if (!ctx.session.adminAddEditSubscriptionPlan){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }

        const result = await ctx.reply(ctx.session.adminAddEditSubscriptionPlan.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          

        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase()==i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        messagesForDeletion.push(messageToSend.messageId);
        //todo - добавить валидацию пришедших символов

        if (ctx.session.adminAddEditSubscriptionPlan.subscriptionKey == undefined) {
            await BotSubscriptionConfigurator.AddEmptySubscription(
                ctx.session.adminAddEditSubscriptionPlan.botId, 
                ctx.session.adminAddEditSubscriptionPlan.subscriptionType,
                messageToSend.messageText);
        } else {
            await BotSubscriptionConfigurator.RenameSubscription(
                ctx.session.adminAddEditSubscriptionPlan.botId,
                ctx.session.adminAddEditSubscriptionPlan.subscriptionKey,
                messageToSend.messageText
            )
        }

        let menuText = await ParentTitles.MenuTitleSubscriptionsText(ctx) 
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);


    }

    public async AddSubscriptionPlanOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];
        if (!ctx.session.adminAddSubscriptionPlanOption){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        
        const result = await ctx.reply(ctx.session.adminAddSubscriptionPlanOption.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        messagesForDeletion.push(messageToSend.messageId);
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()  ){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion);    
            return;
        }
        let option = await ConversationValidators.validateJSON(ctx, messageToSend.messageText);
        if (option === false) { return};
    
        if (ctx.session.adminAddSubscriptionPlanOption.subscriptionType === ESubscriptionType.MARATHON){
            if (
                    !(await ConversationValidators.validateJSONString(ctx, option, 'name')) ||
                    !(await ConversationValidators.validateJSONDate(ctx, option, 'dateStart')) ||
                    !(await ConversationValidators.validateJSONDate(ctx, option, 'dateFinish')) ||
                    !(await ConversationValidators.validateJSONNumber(ctx, option, 'price')) ||
                    !(await ConversationValidators.validateJSONBoolean(ctx, option, 'enabled')) ||
                    !(await ConversationValidators.validateJSONCurrency(ctx, option, 'currency'))
            ) {
                return;
            }
        }

        if (ctx.session.adminAddSubscriptionPlanOption.subscriptionType === ESubscriptionType.FREE_COURSE){
            if (
                    !(await ConversationValidators.validateJSONString(ctx, option, 'name')) ||
                    !(await ConversationValidators.validateJSONNumber(ctx, option, 'lengthInDays')) ||
                    !(await ConversationValidators.validateJSONNumber(ctx, option, 'price')) ||
                    !(await ConversationValidators.validateJSONBoolean(ctx, option, 'enabled')) ||
                    !(await ConversationValidators.validateJSONCurrency(ctx, option, 'currency'))
            ) {
                return;
            }
        }        

        if (ctx.session.adminAddSubscriptionPlanOption.subscriptionType === ESubscriptionType.SCHEDULED_COURSE){
            if (
                    !(await ConversationValidators.validateJSONString(ctx, option, 'name')) ||
                    !(await ConversationValidators.validateJSONNumber(ctx, option, 'lengthInDays')) ||
                    !(await ConversationValidators.validateJSONNumber(ctx, option, 'price')) ||
                    !(await ConversationValidators.validateJSONBoolean(ctx, option, 'enabled')) ||
                    !(await ConversationValidators.validateJSONCurrency(ctx, option, 'currency'))
            ) {
                return;
            }
        }  

        await BotSubscriptionConfigurator.UpdateSubscriptionOption(
            ctx.session.adminAddSubscriptionPlanOption.botId, 
            ctx.session.adminAddSubscriptionPlanOption.subscriptionKey,
            option,
            ctx.session.adminAddSubscriptionPlanOption.subscriptionOptionKey
            )
        

        let menuText = '';
        if (!ctx.session.adminAddSubscriptionPlanOption.subscriptionOptionKey){
            menuText = await ParentTitles.MenuTitleChosenSubscriptionText(ctx) 
        } else{
            menuText = await ParentTitles.MenuTitleChosenSubscriptionOptionText(ctx) 
        }
        

        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);
    }

    public async AddIntegrationPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        let option = await ConversationValidators.validateJSON(ctx, messageToSend.messageText);
        if (option === false) { return};
        if (
                !(await ConversationValidators.validateJSONString(ctx, option, 'name')) ||
                !(await ConversationValidators.validateJSONString(ctx, option, 'token')) ||
                !(await ConversationValidators.validateJSONCurrency(ctx, option, 'currency')) ||
                !(await ConversationValidators.validateJSONString(ctx, option, 'description', true )) 
        ) {
            return;
        }
        const params:PaymentOptionPaymentIntegration={
            name: option.name,
            token: option.token,
            type: EPaymentTypes.INTEGRATION,
            currency:  ((option.currency as string).toUpperCase() as ESupportedCurrency ),
            description: option.description
        }

        messagesForDeletion.push(messageToSend.messageId);
        //todo - добавить валидацию пришедших символов
        const validatedPlanName = messageToSend.messageText;

        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey == undefined) {
            await BotConfigurator.AddBotIntegrationPaymentMethod(ctx.session.adminAddEditPaymentMethod.botId, params )
        } else {
            //edit
        }

        let menuText = await ParentTitles.MenuTitleSubscriptionsText(ctx) 
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);
    }

    public async RenameIntegrationPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

 
        if (!(await ConversationValidators.validateString(ctx, messageToSend.messageText))){
            return;
        }

        messagesForDeletion.push(messageToSend.messageId);


        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey !== undefined) {
            await BotConfigurator.PaymentMethodUpdateName(
                ctx.session.adminAddEditPaymentMethod.botId, 
                ctx.session.adminAddEditPaymentMethod.paymentMethodKey!,
                messageToSend.messageText
                )
            }

        let menuText = await ParentTitles.MenuTitlePaymentSingleOptionText(ctx) 
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true);
    }    

    public async UpdateTokenIntegrationPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

 
        if (!(await ConversationValidators.validateString(ctx, messageToSend.messageText))){
            return;
        }

        messagesForDeletion.push(messageToSend.messageId);


        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey !== undefined) {
            await BotConfigurator.PaymentMethodUpdateToken(
                ctx.session.adminAddEditPaymentMethod.botId, 
                ctx.session.adminAddEditPaymentMethod.paymentMethodKey!,
                messageToSend.messageText
                )
            }

        let menuText = await ParentTitles.MenuTitlePaymentSingleOptionText(ctx) 
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true);
    }        

    public async UpdateDescriptionIntegrationPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        if (!(await ConversationValidators.validateString(ctx, messageToSend.messageText))){
            return;
        }
        messagesForDeletion.push(messageToSend.messageId);
        
        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey !== undefined) {
            await BotConfigurator.PaymentMethodUpdateDescription(
                ctx.session.adminAddEditPaymentMethod.botId, 
                ctx.session.adminAddEditPaymentMethod.paymentMethodKey!,
                messageToSend.messageText
                )
            }

        let menuText = await ParentTitles.MenuTitlePaymentSingleOptionText(ctx) 
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true);
    }    
    
    public async UpdateCurrencyIntegrationPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

 
        if (!(await ConversationValidators.validateCurrency(ctx, messageToSend.messageText))){
            return;
        }

        messagesForDeletion.push(messageToSend.messageId);


        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey !== undefined) {
            await BotConfigurator.PaymentMethodUpdateCurrency(
                ctx.session.adminAddEditPaymentMethod.botId, 
                ctx.session.adminAddEditPaymentMethod.paymentMethodKey!,
                ((messageToSend.messageText as string).toUpperCase() as ESupportedCurrency )
                )
            }

        let menuText = await ParentTitles.MenuTitlePaymentSingleOptionText(ctx) 
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true);
        console.log('ConversationExit');
    }  
    
    public async DeleteIntegrationPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        if (messageToSend.messageText.toLowerCase()!=='yes'){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        }        

        messagesForDeletion.push(messageToSend.messageId);
        
        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey !== undefined) {
            await BotConfigurator.PaymentMethodDelete(
                ctx.session.adminAddEditPaymentMethod.botId, 
                ctx.session.adminAddEditPaymentMethod.paymentMethodKey!,
                messageToSend.messageText
                )
            }

        let menuText = 'Удалено. Нажмите <b>Назад</b> чтобы вернуться в предыдущее меню';
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true, true);
    }        

    public async AddDirectPaymentOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminAddEditPaymentMethod){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminAddEditPaymentMethod.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        let option = await ConversationValidators.validateJSON(ctx, messageToSend.messageText);
        if (option === false) { return};
        if (
                !(await ConversationValidators.validateJSONString(ctx, option, 'name')) ||
                !(await ConversationValidators.validateJSONCurrency(ctx, option, 'currency')) ||
                !(await ConversationValidators.validateJSONString(ctx, option, 'description', true )) 
        ) {
            return;
        }
        const params:PaymentOptionDirectCardTransfer={
            name: option.name,
            type: EPaymentTypes.DIRECT,
            currency:  ((option.currency as string).toUpperCase() as ESupportedCurrency ),
            description: option.description
        }

        messagesForDeletion.push(messageToSend.messageId);

        if (ctx.session.adminAddEditPaymentMethod.paymentMethodKey == undefined) {
            await BotConfigurator.AddBotDirectPaymentMethod(ctx.session.adminAddEditPaymentMethod.botId, params )
        } else {
            //edit
        }

        let menuText = await ParentTitles.MenuTitleSubscriptionsText(ctx);
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText);
    }

    public async DeleteSubscriptionOption(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];


        if (!ctx.session.adminDeleteSubscriptionPlanOption){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminDeleteSubscriptionPlanOption.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        if (messageToSend.messageText.toLowerCase()!=='yes'){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        }        

        messagesForDeletion.push(messageToSend.messageId);
        
        if (ctx.session.adminDeleteSubscriptionPlanOption.subscriptionOptionKey !== undefined) {
            await BotSubscriptionConfigurator.DeleteSubscriptionOption(
                ctx.session.adminDeleteSubscriptionPlanOption.botId,
                ctx.session.adminDeleteSubscriptionPlanOption.subscriptionKey,
                ctx.session.adminDeleteSubscriptionPlanOption.subscriptionOptionKey
            )
            }

        let menuText = 'Удалено. Нажмите <b>Назад</b> чтобы вернуться в предыдущее меню';
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true, true);
    }  
    
    public async UpdateBotRole(conversation: MyConversation, ctx: MyContext) {
        const messagesForDeletion: number[] = [];

        if (!ctx.session.adminUpdateRole){
            await ctx.reply(i18n.getTranslation("basicMessages.invalidSessionData",{
                ns:"translation"}),{parse_mode:"HTML"});
            return;      
        }
        const result = await ctx.reply(ctx.session.adminUpdateRole.message ,{parse_mode: "HTML",disable_web_page_preview:true});
        messagesForDeletion.push(result.message_id);   
          
        let messageToSend = await ConversationHelper.RequestTextMessage(conversation,ctx);
        if (messageToSend === undefined){ 
            await ctx.reply(
                i18n.getTranslation("basicMessages.wrongText",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            return;
        } 
        if (messageToSend.messageText.toLowerCase() == i18n.cancelWord()){
            await ctx.reply(
                i18n.getTranslation("basicMessages.cancelActionAfterwards",
                {ns:"translation"})
                ,{parse_mode:"HTML"}); 
            await ConversationMenuRoutine.CleanConversationHistory(ctx, messagesForDeletion)                
            return;
        }

        let option = await ConversationValidators.validateJSON(ctx, messageToSend.messageText);
        if (option === false) { return};

        if(Object.prototype.toString.call(option) !== '[object Array]') {
            await ctx.reply(
                i18n.getTranslation("basicMessages.invalidFormatRegular",
                {ns:"translation",
                desiredFormat:"array"})
                ,{parse_mode:"HTML"}); 
            return;
        }
        try{
            for (let item of (option as string[])){
                const itemType = Object.prototype.toString.call(item);
                if (itemType !== '[object Number]') {
                    await ctx.reply(
                        i18n.getTranslation("basicMessages.invalidFormat",
                        {ns:"translation",
                        key: item,
                        desiredFormat:"number"})
                        ,{parse_mode:"HTML"}); 
                    return;                    
                }
            }
        }catch {
            await ctx.reply(
                i18n.getTranslation("basicMessages.invalidFormatRegular",
                {ns:"translation",
                desiredFormat:"array of regular values"})
                ,{parse_mode:"HTML"}); 
            return;            
        }

        let uniqueArray : string[] = option.filter((v:any, i:any, a:any) => a.indexOf(v) === i);
        // если дошли сюда - значит наш массив валидный
        // фильтруем оставляя только уникальные значения
        // if (!(await ConversationValidators.validateCurrency(ctx, messageToSend.messageText))){
        //     return;
        // }
        if (ctx.session.adminUpdateRole.roleKey === EBotGroupRoles.admin){
            const found = uniqueArray.find((element) => {
                return element == ctx.chat!.id.toString();
            })

            if (!found){
                await ctx.reply(
                    i18n.getTranslation("basicMessages.canNotDeleteYourselfAdmin",
                    {ns:"translation"})
                    ,{parse_mode:"HTML"}); 
                return;                    
            }
            
        }

        const newSet = new Set<string>(uniqueArray);

        messagesForDeletion.push(messageToSend.messageId);
        await BotConfigurator.UpdateBotRoles(
                ctx.session.adminUpdateRole.botId, ctx.session.adminUpdateRole.roleKey, newSet
                )

        let menuText = ''; 
        switch (ctx.session.adminUpdateRole.roleKey){
            case (EBotGroupRoles.admin): menuText = await ParentTitles.MenuTitleRoles_DetailedText(ctx); break;
            case (EBotGroupRoles.accountant): menuText = await ParentTitles.MenuTitleRoles_DetailedText(ctx); break;
            case (EBotGroupRoles.support): menuText = await ParentTitles.MenuTitleRoles_DetailedText(ctx); break;
            case (EBotGroupRoles.tutor): menuText = await ParentTitles.MenuTitleRoles_DetailedText(ctx); break;
            case (EBotGroupRoles.contentManager): menuText = await ParentTitles.MenuTitleRoles_DetailedText(ctx); break;                        
            default: menuText = 'EBotGroupRoles key not found';
          }        
        
        
        await ConversationMenuRoutine.UpdateMenuAftewards(ctx, messagesForDeletion, menuText, true);
    }      

}


