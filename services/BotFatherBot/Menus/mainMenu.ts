import { Menu, MenuOptions, MenuRange } from "@grammyjs/menu";
import { ParentTitles } from "./helpers/parentTitles";
import { DynamicContentTitles } from "./helpers/dynamicContentTitles";
import { PayloadHelper } from "./helpers/payloadHelper";
import { SharedButtonMethods } from "./helpers/sharedMethods";
import { SubscriptionsMenu } from "./subscriptionsSubMenu";
import { MenuLanguageMenu } from "./languageSubMenu";
import { MenuSupportMenu } from "./supportSubMenu";
import {MenuPaymentOptionsMenu} from "./paymentOptionsSubMenu";
// @ts-ignore: Unreachable code error
import * as i18n from "/opt/i18n";
import { RolesSubMenu } from "./rolesSubMenu";
import { BotManager } from "../../Types/Models/BotManager";
import { DynamicContentMenu } from "./dynamicContent";
import { MyContext } from "/opt/TelegramTypes";


export class GrammyMenu extends Menu<MyContext> {

    private botManager: BotManager;

    private async listMyBots <C extends MyContext>(ctx: C, range: MenuRange<C>){
        const bots = this.botManager.GetMyBots();
        for (const bot of bots){
            const payload = PayloadHelper.StringifyPayload({botId: bot[0]});
            range.submenu({text:'Bot:'+bot[0], payload: payload}, 'botDetM', ParentTitles.MenuTitleBotOptions.bind(this));
            }
        return range;            
    }


    private async AddNewBot(ctx:MyContext){
        await ctx.conversation.enter("bound AddNewBot", {overwrite: true});
    }    

    constructor(botManager: BotManager, id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        this.botManager = botManager;
        
        this
            .submenu(ParentTitles.botMenuButtonCaption.bind(this), "bots", ParentTitles.MenuTitleBots.bind(this)).row()
            .submenu(ParentTitles.LanguagesMenuButtonCaption.bind(this), "menuLng", ParentTitles.MenuTitleLanguagesMenu.bind(this)).row()
            .submenu(ParentTitles.SupportMenuButtonCaption.bind(this), "support", ParentTitles.MenuTitleSupportMenu.bind(this)).row()
            .text(SharedButtonMethods.exitMenuButton.bind(this), (ctx)=>{ctx.deleteMessage();});

        const menuLanguageMenu = new MenuLanguageMenu(this.botManager, "menuLng",  { onMenuOutdated: "Updated, try now." });
        this.register(menuLanguageMenu);

        const menuSupportMenu = new MenuSupportMenu(this.botManager, "support",  { onMenuOutdated: "Updated, try now." });
        this.register(menuSupportMenu);           

        // список моих ботов
        const myBotsMenu = new Menu<MyContext>("bots", { onMenuOutdated: "Updated, try now." });
        myBotsMenu
            .dynamic(this.listMyBots.bind(this)).row()
            .text(SharedButtonMethods.AddButtonCaption.bind(this), this.AddNewBot.bind(this) ).row()
            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
                payload: SharedButtonMethods.ReturnPayload_Empty.bind(this) 
            }, ParentTitles.MenuTitleMain.bind(this));
        this.register(myBotsMenu);      
        
            //Первый уровень после проваливания в бот бота: подписки/каналы и прочее
            const botDetailedMenu = new Menu<MyContext>("botDetM", { onMenuOutdated: "Updated, try now." });
            botDetailedMenu
                //Планы подписки
                .submenu({text: ParentTitles.MenuButtonSubscriptions.bind(this), 
                    payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this)}, "subM" , 
                    ParentTitles.MenuTitleSubscriptions.bind(this)
                    )
                //Способы платежа
                .submenu({text: ParentTitles.MenuPaymentOptionsButton.bind(this), 
                    payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this) }, "pOpts", 
                    ParentTitles.MenuTitlePaymentOptions.bind(this)
                    ).row()
                //Динамический контент  
                .submenu({text: DynamicContentTitles.mainMenuButton.bind(this), 
                    payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this), }, "dCont", 
                    DynamicContentTitles.MainMenuTitle.bind(this)).row()                    
                //Роли
                .submenu({text: ParentTitles.MenuRolesButton.bind(this), 
                    payload: SharedButtonMethods.ReturnPayload_OnlyBot.bind(this) }, "Roles", 
                    ParentTitles.MenuTitleRoles.bind(this)
                    ).row()
                // .submenu({text: 'Информация о подписчиках', payload: SharedButtonMethods.ReturnPayload.bind(this) }, "subscribers").row()
                // .submenu({text: 'Бухгалтерия', payload: SharedButtonMethods.ReturnPayload.bind(this) }, "accounting").row()
                .back({text: SharedButtonMethods.backMenuButton.bind(this),
                    payload: SharedButtonMethods.ReturnPayload_Empty.bind(this) 
                },  ParentTitles.MenuTitleBots.bind(this));
            myBotsMenu.register(botDetailedMenu);
                //Планы подписки
                const botSubscriptionsMenu = new SubscriptionsMenu("subM",  { onMenuOutdated: "Updated, try now." });
                botDetailedMenu.register(botSubscriptionsMenu);
                //Способы платежа
                const menuPaymentOptionsMenu = new MenuPaymentOptionsMenu("pOpts",  { onMenuOutdated: "Updated, try now." });
                botDetailedMenu.register(menuPaymentOptionsMenu);
                //Роли
                const rolesMenu = new RolesSubMenu("Roles",  { onMenuOutdated: "Updated, try now." });
                botDetailedMenu.register(rolesMenu);
                //Динамический контент
                const dynamicContentMenu = new DynamicContentMenu("dCont",  { onMenuOutdated: "Updated, try now." });
                botDetailedMenu.register(dynamicContentMenu);                


    }
}



