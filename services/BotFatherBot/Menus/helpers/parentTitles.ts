
import { PayloadHelper } from "./payloadHelper";
import * as i18n from "/opt/i18n";
import { BotSubscriptionConfigurator } from "../../../Types/Models/BotSubscriptionConfigurator";
import { BotConfigurator } from "../../../Types/Models/BotConfigurator";
import { UpdateMenu } from "./updateMenu";
import { EBotGroupRoles, MyContext } from "/opt/TelegramTypes";
import { CourseSubscriptionOption, ESubscriptionType, MarathonSubscriptionOption } from "/opt/SubscriptionTypes";
import { EPaymentTypes } from "/opt/PaymentTypes";


export class ParentTitles{

    public static async MenuTitleSubscriptions (ctx:MyContext){
        const text = await ParentTitles.MenuTitleSubscriptionsText(ctx);
        UpdateMenu(ctx, text);
    }    

    public static async MenuTitleSubscriptionsText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.menuTitle", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }  
    
    public static async MenuTitleSubscriptionsAdd (ctx:MyContext){
        const text = await ParentTitles.MenuTitleSubscriptionsAddText(ctx);
        UpdateMenu(ctx, text);
    }    

    public static async MenuTitleSubscriptionsAddText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.menuTitleAdd", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }       

    public static async MenuButtonSubscriptions (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const text = i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text
    }            


    public static async MenuTitleBotOptions (ctx:MyContext){    
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.menuTitle", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        UpdateMenu(ctx, text);     
    }     


    public static async MenuTitleMain (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.menuTitle", {
                ns:'botManagerMenu',});
        UpdateMenu(ctx, text);       
    }  
    


    public static async botMenuButtonCaption (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.bots.buttonCaption", {
                ns:'botManagerMenu',
            });
        return text;
    }    

    public static async LanguagesMenuButtonCaption (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.language.buttonCaption", {
                ns:'botManagerMenu',
            });
        return text;
    }        

    public static async MenuTitleLanguagesMenu (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.language.menuTitle", {ns:'botManagerMenu',});
        UpdateMenu(ctx, text);
    }    
    
    public static async SupportMenuButtonCaption (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.support.buttonCaption", {ns:'botManagerMenu',});
        return text;
    }    
    
    public static async MenuTitleSupportMenu (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.support.menuTitle", {ns:'botManagerMenu',});
        UpdateMenu(ctx, text);
    }      
    
    public static SupportMenu_Button_ContentSupport(ctx:MyContext){
        return i18n.getTranslation("mainMenu.support.contentSupport.buttonCaption", {ns:'botManagerMenu'})
    }   
    
    public static SupportMenu_Button_BotSupport (ctx:MyContext){
        return i18n.getTranslation("mainMenu.support.botSupport.buttonCaption", {ns:'botManagerMenu'})
    }      
    
    public static SupportMenu_FAQButtonCaption (ctx:MyContext){
        return i18n.getTranslation("mainMenu.support.FAQ.buttonCaption", {ns:'botManagerMenu'})
    }          
    
    public static async MenuTitleChosenSubscription (ctx:MyContext){
        const text = await ParentTitles.MenuTitleChosenSubscriptionText(ctx);
        UpdateMenu(ctx, text);
    }

    public static async MenuTitleChosenSubscriptionText (ctx:MyContext){
        const payload =  PayloadHelper.ParsePayload(ctx.match);
        if (!payload.botId || !payload.subscriptionKey){
            throw('MenuTitleChosenSubscriptionText Error: payload values are not defined');
        }
        const subscriptionDetails = await BotSubscriptionConfigurator.GetBotSubscription(payload.botId!, payload.subscriptionKey!)
        if (!subscriptionDetails) {
            throw('MenuTitleChosenSubscriptionText Error: subscriptionDetails is not defined DB');  
        }
        const subscriptionType = subscriptionDetails.type;
        const map = subscriptionDetails.options;
        let subscriptionDetailsText = '';
        for (const option of map){
            const optionValue = option[1];
            let lengthParams: string =''
            switch (subscriptionType){
                case ESubscriptionType.MARATHON: {
                    lengthParams = (optionValue as MarathonSubscriptionOption).dateStart +'-'+(optionValue as MarathonSubscriptionOption).dateFinish
                    break;
                }
                case ESubscriptionType.SCHEDULED_COURSE: {
                    lengthParams = (optionValue as CourseSubscriptionOption).lengthInDays+' days.'
                    break;
                }    
                case ESubscriptionType.FREE_COURSE: {
                    lengthParams = (optionValue as CourseSubscriptionOption).lengthInDays+' days.'
                    break;
                }                                    
            }
            subscriptionDetailsText =  subscriptionDetailsText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.subscriptionOptionTitle", {
                ns:'botManagerMenu',
                name: optionValue.name,
                price:  optionValue.price,
                lengthParams: lengthParams,
                currency: optionValue.currency,
                enabled: i18n.translateTrueFalse(optionValue!.enabled,"boolean")                         
            })
        }

        const translatedPlanType = i18n.getTranslation("subscriptionPlanType."+subscriptionDetails.type, {
            ns:"translation"});

        const constSubscriptionActive = i18n.translateTrueFalse(subscriptionDetails?.enabled!, "active")
        const text = i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.menuTitle", {
            ns:'botManagerMenu',
            planType: translatedPlanType,
            planName: subscriptionDetails.name,
            enabled: constSubscriptionActive
        }) + (subscriptionDetailsText ==='' ? ' - ' : subscriptionDetailsText);
        return text;
    }  
    
    public static async MenuTitleBots (ctx:MyContext){
        const text = await ParentTitles.MenuTitleBotsText(ctx);
        UpdateMenu(ctx, text);
    }
    
    public static async MenuTitleBotsText (ctx:MyContext){
        const text = i18n.getTranslation("mainMenu.bots.menuTitle", {
                ns:'botManagerMenu',
                
            });
        return text
    }     

    public static async MenuPaymentOptionsButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }  
    
    public static async MenuAddDirectPaymentOptionsButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.addDirect", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }  
    public static async MenuAddIntegrationPaymentOptionsButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.addIntegration", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }            
    
    public static async MenuTitlePaymentOptions (ctx:MyContext){
        const text = await ParentTitles.MenuTitlePaymentOptionsText(ctx);
        UpdateMenu(ctx, text);
    }    

    public static async MenuTitlePaymentOptionsText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.menuTitle", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }       

    public static async MenuTitlePaymentSingleOption (ctx:MyContext){
        const text = await ParentTitles.MenuTitlePaymentSingleOptionText(ctx);
        UpdateMenu(ctx, text);
    }    

    public static async MenuTitlePaymentSingleOptionText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const result = await BotConfigurator.GetBotPaymentMethod(payload.botId!, payload.paymentOption!);
        let description;
        if (result.description === undefined || result.description.toString().trim()===''){
            description = '-'
        } else {
            description = result.description;
        }
        let text = ''
        if (result.type === EPaymentTypes.INTEGRATION) {
         text = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.details.menuTitleIntegration", {
                ns:'botManagerMenu',
                botId: payload.botId,
                name: result.name,
                currency: result.currency,
                description: description
            });
        } 
        if (result.type === EPaymentTypes.DIRECT) {
            text  = i18n.getTranslation("mainMenu.bots.botDetails.paymentOptions.details.menuTitleDirect", {
                    ns:'botManagerMenu',
                    botId: payload.botId,
                    name: result.name,
                    currency: result.currency,
                    description: description
                });
            }         
        return text;
    }      

    public static async MenuTitleChosenSubscriptionOption (ctx:MyContext){
        const text = await ParentTitles.MenuTitleChosenSubscriptionOptionText(ctx);
        UpdateMenu(ctx, text);
    }

    public static async MenuTitleChosenSubscriptionOptionText (ctx:MyContext){
        const payload =  PayloadHelper.ParsePayload(ctx.match);
        if (!payload.botId || !payload.subscriptionKey || !payload.subscriptionOptionKey){
            throw('MenuTitleChosenSubscriptionOptionText Error: one of payload values is not defined');
        }
        const subscriptionDetails = await BotSubscriptionConfigurator.GetBotSubscription(payload.botId!, payload.subscriptionKey!)
        if (!subscriptionDetails) {
            throw('MenuTitleChosenSubscriptionOptionText Error: subscriptionDetails is not defined DB');  
        }
        const subscriptionType = subscriptionDetails.type;
        const subscriptionOption = subscriptionDetails.options.get(payload.subscriptionOptionKey);
        if (subscriptionOption === undefined){
            throw('MenuTitleChosenSubscriptionOptionText Error: subscriptionOption is not defined DB');            
        }
        let subscriptionOptionDetailsText = '';
        let lengthParams: string =''
        switch (subscriptionType){
            case ESubscriptionType.MARATHON: {
                lengthParams = (subscriptionOption as MarathonSubscriptionOption).dateStart +'-'+(subscriptionOption as MarathonSubscriptionOption).dateFinish
                break;
            }
            case ESubscriptionType.SCHEDULED_COURSE: {
                lengthParams = (subscriptionOption as CourseSubscriptionOption).lengthInDays+' days.'
                break;
            }    
            case ESubscriptionType.FREE_COURSE: {
                lengthParams = (subscriptionOption as CourseSubscriptionOption).lengthInDays+' days.'
                break;
            }                                    
        }
        subscriptionOptionDetailsText =  subscriptionOptionDetailsText + i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.subscriptionOptionTitle", {
            ns:'botManagerMenu',
            name: subscriptionOption!.name, 
            lengthParams: lengthParams,
            price: subscriptionOption!.price,
            currency: subscriptionOption!.currency,
            enabled: i18n.translateTrueFalse(subscriptionOption!.enabled,"boolean")                         
        })
        return subscriptionOptionDetailsText;
    }      

    public static async MenuRolesButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }  

    public static async MenuTitleRoles(ctx:MyContext){
        const text = await ParentTitles.MenuTitleRolesText(ctx);
        UpdateMenu(ctx, text); 
    }    

    public static async MenuTitleRolesText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.menuTitle", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }       

    public static async MenuTitleRoles_Detailed(ctx:MyContext){      
        const text = await ParentTitles.MenuTitleRoles_DetailedText(ctx);
        UpdateMenu(ctx, text);
    }   

    public static async MenuTitleRoles_DetailedText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        if (!payload.botId || !payload.role) {
            throw ('MenuTitleRoles:Error\nPaylod botId or role is not defined')
        }
        const typedKey = payload.role.toString() as keyof typeof EBotGroupRoles;
        const set = await BotConfigurator.GetBotTeamByRole(payload.botId!, EBotGroupRoles[typedKey]);        
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.role."+payload.role+".menuTitle", {
                ns:'botManagerMenu',
                array: Array.from(set as Set<string>),
                botId: payload.botId,
            });
        return text;
    }  

    public static async MenuTitleRoles_AdminButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.role.admin.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }      

    public static async MenuTitleRoles_AccountantButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.role.accountant.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }    
    
    public static async MenuTitleRoles_SupportButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.role.support.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }    

    public static async MenuTitleRoles_TutorButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.role.tutor.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }    
     

    public static async MenuTitleRoles_ContentManagerButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.groups.role.contentManager.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId,
            });
        return text;
    }        
        
} 