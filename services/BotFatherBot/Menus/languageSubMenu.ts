
import * as i18n from "/opt/i18n";
import {SharedButtonMethods} from "./helpers/sharedMethods";

import { Menu, MenuOptions, MenuRange } from '@grammyjs/menu';
import { PayloadHelper } from "./helpers/payloadHelper";
import { ParentTitles } from "./helpers/parentTitles";
import { BotManager } from "services/Types/Models/BotManager";
import { MyContext } from "/opt/TelegramTypes";
import { ReturnSupportedLanguagesWithFags } from "/opt/ConfiguratorTypes";


export class MenuLanguageMenu extends Menu<MyContext>{
    private botManager: BotManager;

    private async setLanguage(ctx:any){
        const payload = PayloadHelper.ParsePayload(ctx.match as string);

        const selectedKey = payload.menuLanguage!.toString().substring(0,2);
        await this.botManager.ChangeBotManagerMenuLanguage(selectedKey);
        await i18n.changeLanguage(
            this.botManager.GetBotManagerMenuLanguage()
        );
        ctx.menu.update();
        await ctx.answerCallbackQuery({text: `you selected ${selectedKey}`})
    } 

    private async listMyLanguages <C extends MyContext>(ctx: C, range: MenuRange<C>){
        const menuLanguage = this.botManager.GetBotManagerMenuLanguage();
        for (const language of ReturnSupportedLanguagesWithFags()){
            const payload = {menuLanguage: language}             
            let buttonCaption = language;
            if (language.substring(0,2) === menuLanguage) {buttonCaption = '\u2705 ' + language}
            const js = PayloadHelper.StringifyPayload(payload);            
            range.text({text:buttonCaption, payload:js}, this.setLanguage.bind(this), (ctx) =>{})
            }
        return range;            
    }

        
    constructor(botManager: BotManager, id: string, options?: MenuOptions<MyContext> | undefined){
        super(id, options);
        this.botManager = botManager;
        this
            .dynamic(this.listMyLanguages.bind(this)).row()
            .back({text: SharedButtonMethods.backMenuButton.bind(this), 
            }, ParentTitles.MenuTitleMain.bind(this));        
    }
}