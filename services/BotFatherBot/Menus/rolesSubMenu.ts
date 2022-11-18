import * as i18n from "/opt/i18n";
import {SharedButtonMethods} from "./helpers/sharedMethods";

import { Menu, MenuOptions, MenuRange } from '@grammyjs/menu';
import { PayloadHelper } from "./helpers/payloadHelper";
import { ParentTitles } from "./helpers/parentTitles";
import { MyContext } from "/opt/TelegramTypes";



export class RolesSubMenu extends Menu<MyContext>{
   
    private async pressUpdateRole(ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        let replyText = '';
        if (!payload.botId || !payload.role){
            throw('pressUpdateRole Error: payload values are not defined');
        }
        const translatedRole = i18n.getTranslation("role."+payload.role, {ns:"translation"});
        replyText = i18n.getTranslation("mainMenu.bots.botDetails.groups.updateRoleMessage", {
            ns:'botManagerMenu',
            botId: payload.botId,
            role: translatedRole
            })        

        replyText = replyText + i18n.cancelPS();

        ctx.session.adminUpdateRole = {
            botId: payload.botId!,
            roleKey: payload.role,
            message: replyText
            
        }
        await ctx.conversation.enter("bound UpdateBotRole", {overwrite: true});
    }            

    constructor(id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        //Верхнее меню ролей
        this
            .submenu({ text: ParentTitles.MenuTitleRoles_AdminButton.bind(this),
                payload: SharedButtonMethods.SetPayload_Role_admin.bind(this) },"roleDetails" ,
                ParentTitles.MenuTitleRoles_Detailed.bind(this) ).row()
            .submenu({ text: ParentTitles.MenuTitleRoles_AccountantButton.bind(this),
                payload: SharedButtonMethods.SetPayload_Role_accountant.bind(this) },"roleDetails" ,
                ParentTitles.MenuTitleRoles_Detailed.bind(this) ).row()
            .submenu({ text: ParentTitles.MenuTitleRoles_SupportButton.bind(this),
                payload: SharedButtonMethods.SetPayload_Role_support.bind(this) },"roleDetails" ,
                ParentTitles.MenuTitleRoles_Detailed.bind(this) ).row()
            .submenu({ text: ParentTitles.MenuTitleRoles_TutorButton.bind(this),
                payload: SharedButtonMethods.SetPayload_Role_tutor.bind(this) },"roleDetails" ,
                ParentTitles.MenuTitleRoles_Detailed.bind(this) ).row()
            .submenu({ text: ParentTitles.MenuTitleRoles_ContentManagerButton.bind(this),
                payload: SharedButtonMethods.SetPayload_Role_contentManager.bind(this) },"roleDetails" ,
                ParentTitles.MenuTitleRoles_Detailed.bind(this) ).row()                                                                            
            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this) },
                ParentTitles.MenuTitleBotOptions.bind(this));


                //статической подменю действий над группой
                const roleActionsMenu =  new Menu<MyContext>("roleDetails", { onMenuOutdated: "Updated, try now." });
                roleActionsMenu
                    .text( {text: 'Обновить состав', 
                        payload: SharedButtonMethods.ReturnPayload.bind(this)}
                        ,this.pressUpdateRole.bind(this)).row()
                    .back({text: SharedButtonMethods.backMenuButton.bind(this),
                         payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this) 
                        }, ParentTitles.MenuTitleRoles.bind(this));                    
                this.register(roleActionsMenu);                
    }
}