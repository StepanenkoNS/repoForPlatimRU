
import { PayloadHelper } from "./payloadHelper";
import * as i18n from "/opt/i18n";
import { EBotGroupRoles, MyContext } from "/opt/TelegramTypes";


export class SharedButtonMethods{ 
    public static AddButtonCaption (ctx:MyContext){
        return i18n.getTranslation("buttons.add", {ns:"translation"});
    }     
    
    public static backMenuButton (ctx:MyContext){
        return i18n.getTranslation("buttons.backMenu", {ns:"translation"})
    }      
    public static exitMenuButton (ctx:MyContext){
        return i18n.getTranslation("buttons.exitMenu", {ns:"translation"})
    }     

    public static  EditButtonCaption (ctx:MyContext){
        return i18n.getTranslation("buttons.edit", {ns:"translation"});
    }    
    public static  DeleteButtonCaption (ctx:MyContext){
        return i18n.getTranslation("buttons.delete", {ns:"translation"});
    }   
    
    public static  RenameButtonCaption (ctx:MyContext){
        return i18n.getTranslation("buttons.rename", {ns:"translation"})
    }     
    
    public static  ReturnPayload (ctx:MyContext){
        const d = new Date().toISOString();
        console.log('ReturnPayload ', d,  ':\n' ,ctx.match);
        if (ctx.match) {
            
            return ctx.match.toString()
        }
        console.log(d, 'empty payload');
        return '';
    }

    public static  ReturnPayload_Empty (ctx:MyContext){
        const d = new Date().toISOString();
        
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayload(ctx.match, []) as string;
            console.log('ReturnPayload_Empty ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return result
        }
        
        return '';
    }   

    public static  ReturnPayload_OnlyBot (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayload(ctx.match, ['B']) as string;
            console.log('ReturnPayload_OnlyBot ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return result
        }
        return '';
    }   

    public static  ReturnPayload_PaymentOption (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayload(ctx.match, ['B', 'P']) as string;
            console.log('ReturnPayload_PaymentOption ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return result
        }
        return '';
    }       
    
    public static  ReturnPayload_Subscription (ctx:MyContext){
        const d = new Date().toISOString();

        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayload(ctx.match, ['B','S']) as string;
            console.log('ReturnPayload_Subscription ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return result
        }
        return '';
    }     
    
    public static  ReturnPayload_SubscriptionOption (ctx:MyContext){
        const d = new Date().toISOString();

        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayload(ctx.match, ['B','S','SO']) as string;
            console.log('ReturnPayload_SubscriptionOption ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return result
        }
        return '';
    }        


    public static  EditSubscriptionOptionsCaption (ctx:MyContext){
        return i18n.getTranslation("mainMenu.bots.botDetails.subscriptions.details.optionsButtonCaption", {ns:'botManagerMenu'});
    }   
    
    public static  SetPayload_Role_admin (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayloadObject(ctx.match, ['B']);
            result.role = EBotGroupRoles.admin;
            console.log('SetPayload_Role_admin ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return PayloadHelper.StringifyPayload(result);
        }
        return '';
    } 

    public static  SetPayload_Role_accountant (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayloadObject(ctx.match, ['B']);
            result.role = EBotGroupRoles.accountant;
            console.log('SetPayload_Role_accountant ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return PayloadHelper.StringifyPayload(result);
        }
        return '';
    }       
    
    public static  SetPayload_Role_support (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayloadObject(ctx.match, ['B']);
            result.role = EBotGroupRoles.support;
            console.log('SetPayload_Role_support', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return PayloadHelper.StringifyPayload(result);
        }
        return '';
    }       
    
    public static  SetPayload_Role_tutor (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayloadObject(ctx.match, ['B']);
            result.role = EBotGroupRoles.tutor;
            console.log('SetPayload_Role_tutor ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return PayloadHelper.StringifyPayload(result);
        }
        return '';
    }       


    public static  SetPayload_Role_contentManager (ctx:MyContext){
        const d = new Date().toISOString();
        if (ctx.match) {
            const result = PayloadHelper.KeepKeysInPayloadObject(ctx.match, ['B']);
            result.role = EBotGroupRoles.contentManager;
            console.log('SetPayload_Role_contentManager ', d,  ':\nin: ' ,ctx.match,'\nout:', result);
            return PayloadHelper.StringifyPayload(result);
        }
        return '';
    }       
}