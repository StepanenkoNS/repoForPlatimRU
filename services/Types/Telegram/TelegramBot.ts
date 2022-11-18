import { conversations, createConversation } from "@grammyjs/conversations";
import { Api, Bot, BotConfig, Context, enhanceStorage, RawApi, session, SessionFlavor } from "grammy";
import { DynamicBotConversations } from "../../BotFatherBot/Conversations/DynamicContentConversations";
import { DynamoDBAdapter } from "../../Utils/Session/grammyStorageAdapter";
import { BotConversations } from "../../BotFatherBot/Conversations/BotConversations";
import { GrammyMenu } from "../../BotFatherBot/Menus/mainMenu";
import { BotManager } from "../Models/BotManager";
import * as i18n from "/opt/i18n";
//@ts-ignore
import { MyContext } from "/opt/TelegramTypes";

//export class TelegramBot extends Bot<MyContext, Api<RawApi>>{
  export class TelegramBot extends Bot<MyContext>{
    constructor(token: string, botManager: BotManager,  config?: BotConfig<MyContext> | undefined){
      super(token, config)

  
      const storage = new DynamoDBAdapter(process.env.botFatherId!, botManager.getChatId(), process.env.telegrafSessionsTable!);
      const enhanced = enhanceStorage({
          storage,
          millisecondsToLive: (60 * 60 * 1000) * 24 * 30, // (60 min) * 24h * 30d
      });
  
      this.use( session({ 
          initial: () => ({ }), 
          storage: enhanced
      })); 
      
      this.on('callback_query:data', async (ctx, next) => {
        console.log(ctx.callbackQuery.data)
        return next()
      });
      
      this.use(conversations());
      const botConversations = new BotConversations(botManager, this);
      this.use(createConversation(botConversations.AddNewBot.bind(botConversations)));
      this.use(createConversation(botConversations.AddSubscriptionPlan.bind(botConversations)));
      this.use(createConversation(botConversations.AddSubscriptionPlanOption.bind(botConversations)));        
      this.use(createConversation(botConversations.AddIntegrationPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.AddDirectPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.RenameIntegrationPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.UpdateTokenIntegrationPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.UpdateCurrencyIntegrationPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.UpdateDescriptionIntegrationPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.DeleteIntegrationPaymentOption.bind(botConversations)));
      this.use(createConversation(botConversations.DeleteSubscriptionOption.bind(botConversations)));
      this.use(createConversation(botConversations.UpdateBotRole.bind(botConversations)));
      
      const dynamicBotConversations = new DynamicBotConversations(botManager, this); 
      this.use(createConversation(dynamicBotConversations.ComposeNewDynamicPost.bind(dynamicBotConversations)));
      const grammyMenu =  new GrammyMenu(botManager,'main',{onMenuOutdated: 'updated, try again'});
      this.use(grammyMenu);    
      
   
  
  
      this.command('menu', async (ctx) => {
        const text = i18n.getTranslation("mainMenu.menuTitle", {
            ns:'botManagerMenu',
        });
        await ctx.reply(text, { reply_markup: grammyMenu , parse_mode: 'HTML'});
      });    
  
  
    }
  } 