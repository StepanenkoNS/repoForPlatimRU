import * as i18n from "/opt/i18n";
import {SharedButtonMethods} from "./helpers/sharedMethods";

import { Menu, MenuOptions, MenuRange } from '@grammyjs/menu';
import { PayloadHelper } from "./helpers/payloadHelper";
import { ParentTitles } from "./helpers/parentTitles";
import { BotSubscriptionConfigurator } from "../../Types/Models/BotSubscriptionConfigurator";
import { MyContext } from "/opt/TelegramTypes";
import { ESubscriptionType } from "/opt/SubscriptionTypes";



export class SubscriptionsMenu extends Menu<MyContext>{

    private async pressAddSubscriptionOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        let replyText = '';
        if (!payload.botId || !payload.subscriptionKey){
            throw('MenuTitleChosenSubscriptionText Error: payload values are not defined');
        }
        const subscriptionDetails = await BotSubscriptionConfigurator.GetBotSubscription(payload.botId!, payload.subscriptionKey!);
        if (!subscriptionDetails) {
            throw('MenuTitleChosenSubscriptionText Error: subscriptionDetails is not defined DB');  
        }

        if (
            payload.subscriptionOptionKey === undefined || 
            !(subscriptionDetails.options.has(payload.subscriptionOptionKey))
        ) {
            //новая опция
            replyText = i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.newOptionMessage", {
                ns:'botManagerMenu',
                botId: payload.botId,
                planName: subscriptionDetails.name,
                planType:  i18n.getTranslation("subscriptionPlanType."+subscriptionDetails.type, {ns:"translation"})
            });
        } else {
            replyText = i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.editOptionMessage", {
                ns:'botManagerMenu',
                botId: payload.botId,
                planName: subscriptionDetails.name,
                planType:  i18n.getTranslation("subscriptionPlanType."+subscriptionDetails.type, {ns:"translation"}),
                optionName: subscriptionDetails.options.get(payload.subscriptionKey!)?.name
            });
        }
        
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.editSubscriptionOption."+subscriptionDetails.type, {
            ns:'botManagerMenu'})        

        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddSubscriptionPlanOption = {
            botId: payload.botId!,
            subscriptionKey: payload.subscriptionKey!,
            subscriptionType: subscriptionDetails.type,
            subscriptionOptionKey: payload.subscriptionOptionKey!,
            message: replyText
            
        }
        await ctx.conversation.enter("bound AddSubscriptionPlanOption", {overwrite: true});
    }    

    private async pressAddNewSubscriptionMarathon(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const translatedPlanType = i18n.getTranslation("subscriptionPlanType.MARATHON", {
            ns:"translation"});

        let replyText = '';
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.addSubscriptionCaption", {
            ns:'botManagerMenu',
            planType: translatedPlanType
            })
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.addEditMessage", {
            ns:'botManagerMenu'})
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditSubscriptionPlan = {
            botId: payload.botId!,
            subscriptionType: ESubscriptionType.MARATHON,
            message: replyText

        }        
        await ctx.conversation.enter("bound AddSubscriptionPlan", {overwrite: true});
    }

    private async pressAddFreeCourseSubscriptionNews(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const translatedPlanType = i18n.getTranslation("subscriptionPlanType.FREE_COURSE", {
            ns:"translation"});

        let replyText = '';
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.addSubscriptionCaption", {
            ns:'botManagerMenu',
            planType: translatedPlanType
            })
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.addEditMessage", {
            ns:'botManagerMenu'})
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditSubscriptionPlan = {
            botId: payload.botId!,
            subscriptionType: ESubscriptionType.FREE_COURSE,
            message: replyText

        }        
        await ctx.conversation.enter("bound AddSubscriptionPlan", {overwrite: true});
    }    

    private async pressAddScheduledCourseSubscriptionNews(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const translatedPlanType = i18n.getTranslation("subscriptionPlanType.SCHEDULED_COURSE", {
            ns:"translation"});

        let replyText = '';
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.addSubscriptionCaption", {
            ns:'botManagerMenu',
            planType: translatedPlanType
            })
        replyText = replyText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.addEditMessage", {
            ns:'botManagerMenu'})
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminAddEditSubscriptionPlan = {
            botId: payload.botId!,
            subscriptionType: ESubscriptionType.SCHEDULED_COURSE,
            message: replyText

        }        
        await ctx.conversation.enter("bound AddSubscriptionPlan", {overwrite: true});
    }    

    private async DeactivateSubscriptionButtonCaption (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match as string);

        if (!payload.botId || !payload.subscriptionKey){
            throw('MenuTitleChosenSubscriptionText Error: payload values are not defined');
        }

        const subscription = await BotSubscriptionConfigurator.GetBotSubscription(payload.botId!, payload.subscriptionKey!);
        if (!subscription) {
            throw('MenuTitleChosenSubscriptionText Error: subscriptionDetails is not defined DB');  
        }

        if (subscription.enabled) {
            return i18n.getTranslation("buttons.deactivate", {ns:"translation"})
        }
        return i18n.getTranslation("buttons.activate", {ns:"translation"})
    }  

    private async pressDeactivateSubscription(ctx:any){
        const payload = PayloadHelper.ParsePayload(ctx.match as string);
        const subscription = await BotSubscriptionConfigurator.GetBotSubscription(payload.botId!, payload.subscriptionKey!);
        
        await BotSubscriptionConfigurator.ActivateSubscription(payload.botId!, payload.subscriptionKey!,!(subscription!.enabled));
        await ParentTitles.MenuTitleChosenSubscription(ctx);
        ctx.menu.update();
    }      

    private async listBotSubscriptionOptions <C extends MyContext>(ctx: C, range: MenuRange<C>){

        if (ctx.match) {
            let payload = PayloadHelper.ParsePayload(ctx.match);
            if (!payload.botId || !payload.subscriptionKey) {
                throw('listBotSubscriptionOptions Error - botId or subscriptionKey is empty')
            }
            const subscription = await BotSubscriptionConfigurator.GetBotSubscription(payload.botId, payload.subscriptionKey)
            if (!subscription) {
                throw('MenuTitleChosenSubscriptionText Error: subscriptionDetails is not defined DB');  
            }
            for (const option of subscription.options){
                
                const translatedPlanType = i18n.getTranslation("subscriptionPlanType."+subscription.type, {
                    ns:"translation"});

                const newPayload = {...payload, ...{subscriptionOptionKey: option[0]} }
                const js = PayloadHelper.StringifyPayload(newPayload);
                const text = option[1].name+'('+translatedPlanType+')';
                console.log('ReturnPayload_listBotSubscriptionOptions ',  ':\nin: ' ,ctx.match,'\nout:', js);
                range.submenu({text: text, payload: js}, "subDetOpt", ParentTitles.MenuTitleChosenSubscriptionOption.bind(this)).row();
                }
            return range;                       
        } else {
            return range;   
        }

    }

    private async listBotSubscriptions <C extends MyContext>(ctx: C, range: MenuRange<C>){
        if (ctx.match) {
            const matchedPayload:string = ctx.match as string;
            let payload = PayloadHelper.ParsePayload(matchedPayload);
            const subscriptionMap = await BotSubscriptionConfigurator.GetBotSubscriptions(payload.botId!)

            for (const subscription of subscriptionMap){
                
                const translatedPlanType = i18n.getTranslation("subscriptionPlanType."+subscription[1].type, {
                    ns:"translation"});

                const newPayload = {...payload, ...{subscriptionKey: subscription[0]} }
                const js = PayloadHelper.StringifyPayload(newPayload);
                console.log('ReturnPayload_listBotSubscriptions ',  ':\nin: ' ,ctx.match,'\nout:', js);
                range.submenu({text: subscription[1].name+'('+translatedPlanType+')', payload: js}, 'subDetM', ParentTitles.MenuTitleChosenSubscription.bind(this)).row();
                }
            return range;                       
        }
        return range;    
    }    

    private async pressDeleteSubscriptionOption(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        if (!payload.botId || !payload.subscriptionKey || !payload.subscriptionOptionKey) {
            throw('listBotSubscriptionOptions Error - botId or subscriptionKey or subscriptionOptionKey is empty')
        }

        let replyText = 'Удаление опции подписки. \nОтправьте в чат слово <b>Yes</b>, если вы действительно хотите удалить'   
        replyText = replyText + i18n.cancelPS();

        ctx.session.adminDeleteSubscriptionPlanOption = {
            botId: payload.botId,
            subscriptionKey: payload.subscriptionKey,
            subscriptionOptionKey: payload.subscriptionOptionKey,
            message: replyText
        }
        await ctx.conversation.enter("bound DeleteSubscriptionOption",{overwrite: true});
    }      
        

    constructor(id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        //Управление планами подписки бота 5795087844
        this
            .submenu({ text: 'Добавить',
                payload: SharedButtonMethods.ReturnPayload.bind(this) },"addPlan" ,
                ParentTitles.MenuTitleSubscriptionsAdd.bind(this) ).row()
            .dynamic(this.listBotSubscriptions.bind(this)).row()
            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload.bind(this) },
                ParentTitles.MenuTitleBotOptions.bind(this));

                //подменю добавления плана (три кнопки)
                const botAddSubscriptionPlanMenu =  new Menu<MyContext>("addPlan", { onMenuOutdated: "Updated, try now." });
                botAddSubscriptionPlanMenu
                    .text( {text: 'Добавить марафон', 
                        payload: SharedButtonMethods.ReturnPayload.bind(this) }
                        , this.pressAddNewSubscriptionMarathon.bind(this))
                    .text( {text: 'Добавить курс по-расписанию', 
                        payload: SharedButtonMethods.ReturnPayload.bind(this) }
                        , this.pressAddScheduledCourseSubscriptionNews.bind(this)).row()                      
                    .text( {text: 'Добавить свободный курс', 
                        payload: SharedButtonMethods.ReturnPayload.bind(this) }
                        , this.pressAddFreeCourseSubscriptionNews.bind(this)).row()
                    .back({text: SharedButtonMethods.backMenuButton.bind(this),
                         payload: SharedButtonMethods.ReturnPayload.bind(this) 
                        }, ParentTitles.MenuTitleSubscriptions.bind(this));                    
                this.register(botAddSubscriptionPlanMenu);

            //Бот: 5795087844/Провалились в план - детальное меню
            const botSubscriptionDetailsMenu = new Menu<MyContext>("subDetM", { onMenuOutdated: "Updated, try now." });
            botSubscriptionDetailsMenu

            // .text({text: SharedButtonMethods.RenameButtonCaption.bind(this), payload: SharedButtonMethods.ReturnPayload.bind(this) },
            //     this.pressRenameSubscription.bind(this)).row()
            .text({text: 'Добавить опцию', 
                payload: SharedButtonMethods.ReturnPayload_Subscription.bind(this) }, 
                this.pressAddSubscriptionOption.bind(this)).row()
            //динамический список опций подписки  
            .dynamic(this.listBotSubscriptionOptions.bind(this)).row()
            .text({text: this.DeactivateSubscriptionButtonCaption.bind(this), 
                payload: SharedButtonMethods.ReturnPayload_Subscription.bind(this) }, 
                this.pressDeactivateSubscription.bind(this))
            .text({text: SharedButtonMethods.DeleteButtonCaption.bind(this), 
                payload: SharedButtonMethods.ReturnPayload_Subscription.bind(this) }, async (ctx) => {
                await ctx.reply(i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.canNotDeleteMessage", {ns:'botManagerMenu'}),{parse_mode: "HTML"});
            }
                ).row()

            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload_Subscription.bind(this) }
                ,ParentTitles.MenuTitleSubscriptions.bind(this))
        this.register(botSubscriptionDetailsMenu);

                //опции выбранного плана подписки - очищаем последний ключ payload
                const botSubscriptionOptionsMenu = new Menu<MyContext>("subDetOpt", { onMenuOutdated: "Updated, try now." });
                botSubscriptionOptionsMenu
                    .text({text:'Обновить', 
                        payload: SharedButtonMethods.ReturnPayload_SubscriptionOption.bind(this)}, 
                        this.pressAddSubscriptionOption.bind(this))
                    .text({text: SharedButtonMethods.DeleteButtonCaption.bind(this), 
                        payload: SharedButtonMethods.ReturnPayload_SubscriptionOption.bind(this)}, 
                        this.pressDeleteSubscriptionOption.bind(this)).row()
                    .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                        payload: SharedButtonMethods.ReturnPayload_Subscription.bind(this)}
                    ,ParentTitles.MenuTitleChosenSubscription.bind(this)
                    )
                botSubscriptionDetailsMenu.register(botSubscriptionOptionsMenu);                
    }
}