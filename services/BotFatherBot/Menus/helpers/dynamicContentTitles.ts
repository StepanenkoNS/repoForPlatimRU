import { PayloadHelper } from "./payloadHelper";
import { UpdateMenu } from "./updateMenu";
//@ts-ignore
import * as i18n from "/opt/i18n";
import { MyContext } from "/opt/TelegramTypes";



export class DynamicContentTitles{

    public static async MainMenuTitle (ctx:MyContext){
        const text = await DynamicContentTitles.MainMenuTitlesText(ctx);
        UpdateMenu(ctx, text);
    }    

    public static async MainMenuTitlesText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.menuTitle", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }  

    public static async mainMenuButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const text = i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text
    }       
    
    public static async composeNewPostButton (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);

        const text = i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.composeNewPost.buttonCaption", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text
    }   
    
    public static async composeNewPostTitleText (ctx:MyContext){
        const payload = PayloadHelper.ParsePayload(ctx.match);
        const text = i18n.getTranslation("mainMenu.bots.botDetails.dynamicContent.composeNewPost.menuTitle", {
                ns:'botManagerMenu',
                botId: payload.botId
            });
        return text;
    }  

    public static async composeNewPostTitle (ctx:MyContext){
        const text = await DynamicContentTitles.composeNewPostTitleText(ctx);
        UpdateMenu(ctx, text);
    }       

        
} 