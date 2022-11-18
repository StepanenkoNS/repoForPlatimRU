import * as i18n from "/opt/i18n";
import {SharedButtonMethods} from "./helpers/sharedMethods";

import { Menu, MenuOptions, MenuRange } from '@grammyjs/menu';

import { ParentTitles } from "./helpers/parentTitles";
import { BotManager } from "../../Types/Models/BotManager";
import { MyContext } from "/opt/TelegramTypes";


export class MenuSupportMenu extends Menu<MyContext>{
    private botManager: BotManager;


        
    constructor(botManager: BotManager, id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        this.botManager = botManager;
        this
        .text({text: ParentTitles.SupportMenu_Button_ContentSupport.bind(this)}).row()
        .text({text: ParentTitles.SupportMenu_Button_BotSupport.bind(this) }).row()
        .text({text: ParentTitles.SupportMenu_FAQButtonCaption.bind(this)}).row()
        .back({text: SharedButtonMethods.backMenuButton.bind(this), 
            }, ParentTitles.MenuTitleMain.bind(this)).row();        
    }
}