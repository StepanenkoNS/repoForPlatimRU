// @ts-ignore: Unreachable code error
import * as i18n from "/opt/i18n";
import {SharedButtonMethods} from "./helpers/sharedMethods";

import { Menu, MenuOptions, MenuRange } from '@grammyjs/menu';
import { PayloadHelper } from "./helpers/payloadHelper";
import { ParentTitles } from "./helpers/parentTitles";
import { BotConfigurator } from "../../Types/Models/BotConfigurator";
import { MyContext } from "/opt/TelegramTypes";
import { EPaymentTypes } from "/opt/PaymentTypes";



export class MenuPaymentOptionsMenu extends Menu<MyContext>{

    private async listBotPaymentOptions <C extends MyContext>(ctx: C, range: MenuRange<C>){
        if (ctx.match) {
            const matchedPayload:string = ctx.match as string;
            let incomingPayload = PayloadHelper.ParsePayload(matchedPayload);
            const map = await BotConfigurator.GetBotPaymentMethodsAsMap(incomingPayload.botId!);
            let resultArray = [];
            for (const item of map){
                incomingPayload = {...incomingPayload, ...{paymentOption: item[0]} }
                const js = PayloadHelper.StringifyPayload(incomingPayload);
                //возможно поменять тайтл
                if (item[1].type === EPaymentTypes.DIRECT) {
                    range.submenu({text: item[1].name+' '+item[1].currency, payload: js}, "pOd", 
                    ParentTitles.MenuTitlePaymentSingleOption.bind(this)).row();
                }
                if (item[1].type ===  EPaymentTypes.INTEGRATION) {
                    range.submenu({text: item[1].name+' '+item[1].currency, payload: js}, "pOi", 
                    ParentTitles.MenuTitlePaymentSingleOption.bind(this)).row();
                }                
            }
            return range;                  
        }
        return range;    
    }    

    private async pressAddIntegrationPaymentOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.details.newIntegrationPaymentOptionMessage", {
            ns:'botManagerMenu'});
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.details.editIntegrationPaymentOption", {
                ns:'botManagerMenu'})    
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: undefined,
            message: replyText
        }
        await ctx.conversation.enter("bound AddIntegrationPaymentOption", {overwrite: true});
    }  
    
    private async pressAddDirectPaymentOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.details.newDirectPaymentOptionMessage", {
            ns:'botManagerMenu'});
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.details.editDirectPaymentOption", {
                ns:'botManagerMenu'})    
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: undefined,
            message: replyText
        }
        await ctx.conversation.enter("bound AddDirectPaymentOption", {overwrite: true});
    }      
    
    private async pressRenameIntegrationPaymentOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = 'Переименование способа оплаты. Отправьте в чат новое название'   
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: payload.paymentOption,
            message: replyText
        }
        await ctx.conversation.enter("bound RenameIntegrationPaymentOption", {overwrite: true});
    }     
    
    private async pressUpdateTokenIntegrationPaymentOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = 'Обновление секретного токена платежной системы. Отправьте в чат новое название'   
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: payload.paymentOption,
            message: replyText
        }
        await ctx.conversation.enter("bound UpdateTokenIntegrationPaymentOption", {overwrite: true});
    }  
    
    private async pressUpdateCurrencyIntegrationPaymentOption(ctx:MyContext){
        console.log('pressUpdateCurrencyIntegrationPaymentOption - enter');
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = 'Обновление валюты способа платежа. Отправьте в чат новый код валюты (например, RUB).'   
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: payload.paymentOption,
            message: replyText
        }
        await ctx.conversation.enter("bound UpdateCurrencyIntegrationPaymentOption", {overwrite: true});
    }
    
    private async pressUpdateDescriptionIntegrationPaymentOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = 'Обновление описание способа платежа. Отправьте в чат новый текст описания.'   
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: payload.paymentOption,
            message: replyText
        }
        await ctx.conversation.enter("bound UpdateDescriptionIntegrationPaymentOption", {overwrite: true});
    }        

    private async pressDeleteIntegrationPaymentOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        let replyText = 'Удаление способа платежа. \nОтправьте в чат слово <b>Yes</b>, если вы действительно хотите удалить'   
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditPaymentMethod = {
            botId: payload.botId!,
            paymentMethodKey: payload.paymentOption,
            message: replyText
        }
        await ctx.conversation.enter("bound DeleteIntegrationPaymentOption", {overwrite: true});
    }      
    
    constructor(id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        this
            .text( {text: ParentTitles.MenuAddDirectPaymentOptionsButton.bind(this), payload: SharedButtonMethods.ReturnPayload.bind(this) }, this.pressAddDirectPaymentOption.bind(this))
            .text( {text: ParentTitles.MenuAddIntegrationPaymentOptionsButton.bind(this), payload: SharedButtonMethods.ReturnPayload.bind(this) }, this.pressAddIntegrationPaymentOption.bind(this)).row()
            .dynamic(this.listBotPaymentOptions.bind(this)).row()
            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload.bind(this) 
            }, ParentTitles.MenuTitleBotOptions.bind(this));
            

            const DetailedPaymentOptionIntegrationMenu = new Menu<MyContext>("pOi", { onMenuOutdated: "Updated, try now." });
            DetailedPaymentOptionIntegrationMenu
                .text({text:'Переименовать', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressRenameIntegrationPaymentOption.bind(this))
                .text({text:'Обновить описание', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressUpdateDescriptionIntegrationPaymentOption.bind(this)).row()
                .text({text:'Обновить токен', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressUpdateTokenIntegrationPaymentOption.bind(this))
                .text({text:'Сменить валюту', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressUpdateCurrencyIntegrationPaymentOption.bind(this)).row()
                .text({text:'Удалить способ платежа', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressDeleteIntegrationPaymentOption.bind(this)).row()
                .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                    payload: SharedButtonMethods.ReturnPayload_PaymentOption.bind(this)},
                    ParentTitles.MenuTitlePaymentOptions.bind(this));

            this.register(DetailedPaymentOptionIntegrationMenu);    

            const DetailedPaymentOptionDirectMenu = new Menu<MyContext>("pOd", { onMenuOutdated: "Updated, try now." });
            DetailedPaymentOptionDirectMenu
                .text({text:'Переименовать', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressRenameIntegrationPaymentOption.bind(this))
                .text({text:'Обновить описание', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressUpdateDescriptionIntegrationPaymentOption.bind(this)).row()
                .text({text:'Сменить валюту', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressUpdateCurrencyIntegrationPaymentOption.bind(this)).row()
                .text({text:'Удалить способ платежа', payload: SharedButtonMethods.ReturnPayload.bind(this)}, this.pressDeleteIntegrationPaymentOption.bind(this)).row()
                .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                    payload: SharedButtonMethods.ReturnPayload_PaymentOption.bind(this)},
                    ParentTitles.MenuTitlePaymentOptions.bind(this));
                this.register(DetailedPaymentOptionDirectMenu);  

            
    }
}