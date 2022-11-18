import { AWSError } from "aws-sdk";
import { CreateSecretResponse, GetSecretValueRequest, GetSecretValueResponse, UpdateSecretResponse } from "aws-sdk/clients/secretsmanager";
import axios from "axios";
import { createSecrets, getSecrets, updateSecrets, deleteSecret } from "./Helpers/secretsHelper";
import { v4 } from "uuid";
import { nanoid } from "../../Utils/Other/nanoid";
import { ddbDocClient } from "../../Utils/DDB/ddbDocClient";
import { BotManager } from "./BotManager";
//@ts-ignore
import { EPaymentTypes, ESupportedCurrency, PaymentOption, PaymentOptionDirectCardTransfer, PaymentOptionPaymentIntegration } from "/opt/PaymentTypes";
//@ts-ignore
import { IBotBasicMessages, IBotConfiguration } from "/opt/ConfiguratorTypes";
import { BotGroupRoles, EBotGroupRoles } from "/opt/TelegramTypes";


export class BotConfigurator{
    private botProperties : IBotConfiguration;   
    private botToken: string;
    private basicMessages: IBotBasicMessages;
    private paymentMethodsMap: Map<string, PaymentOption>;

    public isActive (){
      return this.botProperties.active ? this.botProperties.active : false;
    }
    

    static async GetOrCreateBot(botId: string) {
      const bot = new this(botId);
      await bot.Init();
      return bot;
    }

    static async DeleteBot(botId: string) {
      const bot = new this(botId);
      await bot.deInit();

    }

   public static async CreateNewBot(  {
      botId,
      botTeam,
      defaultLanguage = 'ru',
      additionalLanguages = []
    } : IBotConfiguration, botToken: string){
      const bot = new this(botId, botToken);      

      try{
      await bot.Init({
        botId: botId,
        botTeam: botTeam,
        defaultLanguage: defaultLanguage,
        additionalLanguages: additionalLanguages
      });
      return bot;
    } catch (error){
      console.log(error);
      throw(error);
    }


    }

    private async Init(params?:IBotConfiguration){
      try {
      if (params) {
        //create bot

        await this.SetWebhook();
        await this.GetOrCreateSecretARN();

        await this.AddBotConfiguration(params);

        await this.SetBasicMessages();

      } else {
        //get bot
        await this.GetBotConfiguration();
        await this.GetBasicMessages();
        await this.InitializeBotPaymentMethods();
      }
    } catch(error) {
      console.log(error);
      throw(error);
    }
    }

    private async deInit(){
        await this.GetBotConfiguration();
        await this.RemoveWebhook();
        await this.RemoveSecretARN();
        await this.DisableBotConfiguration();
        await this.RemoveBasicMessages();
    } 

    constructor(botId: string, botToken?: string, params? :IBotConfiguration ){
      this.botProperties = 
        {botId : botId};

      if (botToken) {
        this.botToken = botToken;
      }
      //this.botProperties.botId = botId;
  
      if (params) {
        this.botProperties = params;
      }

      this.paymentMethodsMap = new Map<string, PaymentOptionPaymentIntegration>;

    }   

    private async SetWebhook(){
      console.log('Inside SetWebHook method')
      try{
        const registrationUrl = 
        'https://api.telegram.org/bot'
        + this.botToken
        + '/setWebHook?url='
        + process.env.messageBotTelegramFacingGW!
        + '/'
        + this.botProperties.botId;
        await axios.post(registrationUrl);
        console.log('registration URL is set succesfully')
      }
      catch(error) {
        console.log(error);
        throw ('BotConfigurator:SetWebhook:Error');
      }
    }  
    private async RemoveWebhook(){
      const registrationUrl = 
      'https://api.telegram.org/bot'
      +this.botToken
      +'/setWebHook?remove';
      await axios.get(registrationUrl);
  }       

    private async GetBotConfiguration(){
      try {
        const dbResponce = await ddbDocClient.get({
          Key: {
            'PK': 'BOT#'+this.botProperties.botId+"#CONFIGURATION",
            'SK': 'CONFIGURATION'
            },
          TableName: process.env.botsTable!
        })      
        
        if (!dbResponce.Item) { throw ('Bot not found')}
        this.botProperties.botTokenARN = dbResponce.Item.botTokenARN; 
        this.botProperties.additionalLanguages = dbResponce.Item.additionalLanguages;
        this.botProperties.botTeam = dbResponce.Item.botTeam;
        this.botProperties.defaultLanguage = dbResponce.Item.defaultLanguage;
        this.botProperties.active = dbResponce.Item.active;

        const p: GetSecretValueRequest = {SecretId: this.botProperties.botTokenARN!}
        this.botToken=(await getSecrets(p) as GetSecretValueResponse).SecretString!;  
      } catch (error){
          console.log(error);
          throw(error);
      }
    }

    public async SetBasicMessages(messages?:IBotBasicMessages){
      try {
        let msg: IBotBasicMessages;
        if (!messages) {
          const start = new Map<string, string>;
          start.set('en', 'Hello in this bot');
          start.set('ru', 'Привет в этом боте');

          const contacts = new Map<string, string>;
          contacts.set('en', 'Nick @likeahurricane');
          contacts.set('ru', 'Николай @likeahurricane');

          const noSubscription = new Map<string, string>;
          noSubscription.set('en', 'You do not have active subscription. Please contact bot administrator');
          noSubscription.set('ru', 'У вас нет подписки, обратитесь к администратору бота');

           msg = {
              start: start,
              contacts: contacts,
              noSubscription: noSubscription
          }
        } else {
          msg = messages;
        }
      const botBASICMESSAGES = {
        PK: 'BOT#'+this.botProperties.botId+"#CONFIGURATION",
        SK: 'BASICMESSAGES',
        messages: msg

      }
      const result = await ddbDocClient.put({
        TableName: process.env.botsTable!,
        Item: botBASICMESSAGES
        });  
        console.log(result);
        
      } catch(error){
        console.log(error);
        throw (error);
      }       
    }

    private async GetBasicMessages(){
      const dbResponce = await ddbDocClient.get({
        Key: {
              PK: 'BOT#'+this.botProperties.botId+"#CONFIGURATION",
              SK: 'BASICMESSAGES',
            },
        TableName: process.env.botsTable!
      })      
      
      if (!dbResponce.Item) { await this.SetBasicMessages(); }
      else {
        this.basicMessages = {
          start: dbResponce.Item.messages.start,
          contacts: dbResponce.Item.messages.contacts,
          noSubscription: dbResponce.Item.messages.noSubscription
        }

      }       
    }    

    private async RemoveSecretARN(){
     await deleteSecret({
        SecretId: this.botProperties.botTokenARN!,
        ForceDeleteWithoutRecovery: true            
      });
    }
    private async GetOrCreateSecretARN(){
      try{
        let result: AWSError | CreateSecretResponse | UpdateSecretResponse;
        let secretARN = '';

        await getSecrets({SecretId: 'BOT_'+this.botProperties.botId})
        .then( async (data) => {
          console.log(data);
          await updateSecrets({
            SecretId: 'BOT_'+this.botProperties.botId,
            SecretString: this.botToken
          })
          secretARN = (data as GetSecretValueResponse).ARN!;          
        })
        .catch( async (error:AWSError) => {
          console.log(error);
          if (error.code = 'ResourceNotFoundException') {
            result = await createSecrets({
              Name: 'BOT_'+this.botProperties.botId,
              SecretString: this.botToken,
              Tags: [
                {Key: 'bot',
                Value: this.botProperties.botId},
              ]              
            })
            secretARN = (result as CreateSecretResponse).ARN!;   
        } else {
          console.log(error);
          throw (error);
        }
        })
         this.botProperties.botTokenARN = secretARN;
         console.log('Secret ARN initialized successfully', secretARN)
        } catch (error){
        console.log(error);
        throw(error);
      }

    }    

    private async AddBotConfiguration(params: IBotConfiguration){
      try {
        this.botProperties = {
          botId: params.botId,
          botTeam: params.botTeam,
          botTokenARN: this.botProperties.botTokenARN ? this.botProperties.botTokenARN : '',
          additionalLanguages: params.additionalLanguages,
          defaultLanguage: params.defaultLanguage,
          active: true
        }

      const botCONFIGURATION = {
        PK: 'BOT#'+this.botProperties.botId+"#CONFIGURATION",
        SK: 'CONFIGURATION',
        botTokenARN: this.botProperties.botTokenARN ? this.botProperties.botTokenARN : '' ,
        createdAt: new Date().toISOString(),
        defaultLanguage: this.botProperties.defaultLanguage,
        additionalLanguages: this.botProperties.additionalLanguages,
        botTeam: this.botProperties.botTeam,
        active: true
      }
      const result = await ddbDocClient.put({
        TableName: process.env.botsTable!,
        Item: botCONFIGURATION,
        });
        console.log(result);
      }
      catch (error) {
        console.log(error);
        throw(error)
      }
    }

    private async DisableBotConfiguration(){
      await ddbDocClient.update({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+this.botProperties.botId+"#CONFIGURATION",
          SK: 'CONFIGURATION'
        },
        UpdateExpression: "set lastDeletedAt = :x, Active = :y",
        ExpressionAttributeValues: {
            ":x": new Date().toISOString(),
            ":y": false
        }        
        });
    }

    private async RemoveBasicMessages(){
      await ddbDocClient.delete({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+this.botProperties.botId+"#CONFIGURATION",
          SK: 'BASICMESSAGES',
        }    
        });
    }    
        
    public GetBotToken() {
      return this.botToken;
    }

    public BotLanguages(){
      const languages : string[] = [];
      languages.push(this.botProperties.defaultLanguage!);
      for (const locale of this.botProperties.additionalLanguages!) { 
        languages.push(locale);
    }
    return languages;
  }
  
  public IsUserAdminOfTheChat(chatId: string){
    if (this.botProperties.botTeam && this.botProperties.botTeam.admin) {
      if (this.botProperties.botTeam.admin.has(chatId))
       {return true;} else {return false;}
    }
    return false;
  }

  public async AddBotPaymentMethod(params: PaymentOption){
    try {
      const key = nanoid();
      const item = {
        PK: 'BOT#'+this.botProperties.botId+"#PAYMENMETHOD",
        SK: nanoid(),
        paymentOption: params
      }
      const result = await ddbDocClient.put({
        TableName: process.env.botsTable!,
        Item: item
      });
      console.log(result);
      this.paymentMethodsMap.set(key,params);
    } catch (error) {
      console.log(error);
      throw('BotConfigurator:AddBotPaymentMethod Error')
    }
  }

  public static async AddBotIntegrationPaymentMethod(botId: string, params: PaymentOptionPaymentIntegration){
    try {
      const key = nanoid();

      let updatedParams:PaymentOptionPaymentIntegration = {
        name: params.name,
        currency: params.currency,
        description: params.description,
        type: params.type
      }
      if (params.type ===EPaymentTypes.INTEGRATION) {
        const result = await createSecrets({
          Name: 'BOT_'+ botId+'_PaymentToken_'+nanoid(),
          SecretString: params.token,
          Tags: [
            {Key: 'bot',
            Value: botId},
          ]  
        })
        const secretARN = (result as CreateSecretResponse).ARN!;
        updatedParams.tokenARN = secretARN;
      }
      const item = {
        PK: 'BOT#'+botId+"#PAYMENMETHOD",
        SK: key,
        paymentOption: updatedParams
      }
      const result = await ddbDocClient.put({
        TableName: process.env.botsTable!,
        Item: item
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      throw('BotConfigurator:AddBotPaymentMethod Error')
    }
  }  

  private async InitializeBotPaymentMethods(){
    try{
      this.paymentMethodsMap.clear();
      const dbResponce = await ddbDocClient.query({
          TableName: process.env.botsTable!,
          KeyConditionExpression: "PK = :PK",
          ExpressionAttributeValues: {
              ':PK': 'BOT#'+this.botProperties.botId+"#PAYMENMETHOD"
            }        
      });
      if (dbResponce.Items) {
          for (const item of dbResponce.Items) { 
              this.paymentMethodsMap.set(item.SK,item.paymentOption); 
          }
      }
    } catch (error){
        console.log(error);
        throw('ChatConfigurator:InitializeSubscriptions Error');
    }
  }

  public async GetBotPaymentMethodsAsMap(){
    return this.paymentMethodsMap;
  }  

  public static async GetBotPaymentMethodsAsMap(botId: string){
    try{
      const paymentMethodsMap: Map<string, PaymentOption> = new Map<string, PaymentOptionPaymentIntegration>;
      const dbResponce = await ddbDocClient.query({
          TableName: process.env.botsTable!,
          KeyConditionExpression: "PK = :PK",
          ExpressionAttributeValues: {
              ':PK': 'BOT#'+botId+"#PAYMENMETHOD"
            }        
      });
      if (dbResponce.Items) {
          for (const item of dbResponce.Items) { 
              paymentMethodsMap.set(item.SK,item.paymentOption); 
          }
      } 
      return paymentMethodsMap;
    } catch (error){
        console.log(error);
        throw('BotConfigurator:GetBotPaymentMethodsAsMap Error');
    }
  }    

  public static async GetBotPaymentMethod(botId: string, SK:string){
    try{

      const dbResponce = await ddbDocClient.get({
        Key: {
          'PK': 'BOT#'+botId+"#PAYMENMETHOD",
          'SK': SK
          },
        TableName: process.env.botsTable!
      })      
      
      if (!dbResponce.Item) { throw ('Bot not found')}
      const paymentOption : PaymentOption = {
        name: dbResponce.Item.paymentOption.name,
        type: dbResponce.Item.paymentOption.type,
        //tokenARN: dbResponce.Item.paymentOption.tokenARN,
        currency: dbResponce.Item.paymentOption.currency,
        description:dbResponce.Item.paymentOption.description
      }
      return paymentOption;
    } catch (error){
        console.log(error);
        throw('BotConfigurator:GetBotPaymentMethod static Error');
    }
  }  

  public async GetBotPaymentMethodsAsArray(){
    return Array.from(this.paymentMethodsMap);
  }   

  public static async PaymentMethodUpdateName(botId: string, SK: string, newName: string){
    try {

      await ddbDocClient.update({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+botId+"#PAYMENMETHOD",
          SK: SK,
        },
        UpdateExpression: "set #paymentOption.#optionKey = :value",
        ExpressionAttributeNames: {
          "#paymentOption": "paymentOption",
          "#optionKey": "name"
        },
        ExpressionAttributeValues: {
            ":value": newName
        }        
        });
    } catch (error) {
      console.log(error);
      throw('BotConfigurator:RenameIntegrationPaymentMethod Error')
    }
  }    

  public static async PaymentMethodUpdateToken(botId: string, SK: string, newToken: string){
    try{
      //получаем ARN старого токена
      const dbResponce = await ddbDocClient.get({
        Key: {
          'PK': 'BOT#'+botId+"#PAYMENMETHOD",
          'SK': SK
          },
        TableName: process.env.botsTable!
      })      
      if (!dbResponce.Item) { throw ('Bot not found')}
      const oldTokenArn = dbResponce.Item.paymentOption.tokenARN;

      //создаем новый токен
      const result = await createSecrets({
        Name: 'BOT_'+ botId+'_PaymentToken_'+nanoid(),
        SecretString: newToken,
        Tags: [
          {Key: 'bot',
          Value: botId},
        ]  
      })
      const newSecretARN = (result as CreateSecretResponse).ARN!;

      //обновляем значение токена в базе
      await ddbDocClient.update({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+botId+"#PAYMENMETHOD",
          SK: SK,
        },
        UpdateExpression: "set #paymentOption.#optionKey = :value",
        ExpressionAttributeNames: {
          "#paymentOption": "paymentOption",
          "#optionKey": "tokenArn"
        },
        ExpressionAttributeValues: {
            ":value": newSecretARN
        }        
        });
      //удаляем старый токен из AWS
      await deleteSecret({
          SecretId: oldTokenArn,
          ForceDeleteWithoutRecovery: true            
        });
    } catch (error){
        console.log(error);
        throw('BotConfigurator:PaymentMethodUpdateDescription static Error');
    }
  }     
  
  public static async PaymentMethodUpdateDescription(botId: string, SK: string, newDescription: string){
    try {

      await ddbDocClient.update({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+botId+"#PAYMENMETHOD",
          SK: SK,
        },
        UpdateExpression: "set #paymentOption.#optionKey = :value",
        ExpressionAttributeNames: {
          "#paymentOption": "paymentOption",
          "#optionKey": "description"
        },
        ExpressionAttributeValues: {
            ":value": newDescription
        }        
        });
    } catch (error) {
      console.log(error);
      throw('BotConfigurator:PaymentMethodUpdateDescription Error')
    }
  } 
  
  public static async PaymentMethodUpdateCurrency(botId: string, SK: string, newCurrency: ESupportedCurrency){
    try {

      await ddbDocClient.update({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+botId+"#PAYMENMETHOD",
          SK: SK,
        },
        UpdateExpression: "set #paymentOption.#optionKey = :value",
        ExpressionAttributeNames: {
          "#paymentOption": "paymentOption",
          "#optionKey": "currency"
        },
        ExpressionAttributeValues: {
            ":value": newCurrency
        }        
        });
    } catch (error) {
      console.log(error);
      throw('BotConfigurator:PaymentMethodUpdateCurrency Error')
    }
  }       

  public static async PaymentMethodDelete(botId: string, SK: string, newToken: string){
    try{
      //получаем ARN старого токена
      const dbResponce = await ddbDocClient.get({
        Key: {
          'PK': 'BOT#'+botId+"#PAYMENMETHOD",
          'SK': SK
          },
        TableName: process.env.botsTable!
      })      
      if (!dbResponce.Item) { throw ('Bot not found')}
      const oldTokenArn = dbResponce.Item.paymentOption.tokenARN;


      //удаляем строку из базы
      await ddbDocClient.delete({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+botId+"#PAYMENMETHOD",
          SK: SK,
        }      
        });
      //удаляем старый токен из AWS
      await deleteSecret({
          SecretId: oldTokenArn,
          ForceDeleteWithoutRecovery: true            
        });
    } catch (error){
        console.log(error);
        throw('BotConfigurator:PaymentMethodDelete static Error');
    }
  }   
  
  public static async AddBotDirectPaymentMethod(botId: string, params: PaymentOptionDirectCardTransfer){
    try {
      const key = nanoid();
      let updatedParams:PaymentOptionDirectCardTransfer = {
        name: params.name,
        currency: params.currency,
        description: params.description,
        type: params.type
      }
      const item = {
        PK: 'BOT#'+botId+"#PAYMENMETHOD",
        SK: key,
        paymentOption: updatedParams
      }
      const result = await ddbDocClient.put({
        TableName: process.env.botsTable!,
        Item: item
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      throw('BotConfigurator:AddBotDirectPaymentMethod Error')
    }
  }  

  public static async GetBotTeamByRole(botId: string, roleKey: EBotGroupRoles){
    try {
      const dbResponce = await ddbDocClient.get({
        Key: {
          'PK': 'BOT#'+botId+"#CONFIGURATION",
          'SK': 'CONFIGURATION',
          },
        TableName: process.env.botsTable!
      });

      if (!dbResponce.Item) {
        const msg = 'BotConfigurator:GetBotTeam:Error Bot not exists '+ botId;
        throw (msg);
      }
      if (!dbResponce.Item.botTeam){
        const msg = 'BotConfigurator:GetBotTeam:Error BotTeam not exists '+ botId;
        throw (msg);
      }

      let result: BotGroupRoles = {
        admin: new Set<string>(),
        accountant: new Set<string>(),
        support: new Set<string>(),
        tutor: new Set<string>(),
        contentManager: new Set<string>()
      }      
      result = dbResponce.Item.botTeam;
    
      let typedKey = roleKey.toString() as keyof typeof EBotGroupRoles;
      if (result[typedKey]==null) {
        return new Set<string>()
      } 
      return result[typedKey];
    }
    catch (error) {
      console.log(error);
      throw(error)
    }
  }  


  public static async GetBotTeam(botId: string){
    try {
      const dbResponce = await ddbDocClient.get({
        Key: {
          'PK': 'BOT#'+botId+"#CONFIGURATION",
          'SK': 'CONFIGURATION',
          },
        TableName: process.env.botsTable!
      });

      if (!dbResponce.Item) {
        const msg = 'BotConfigurator:GetBotTeam:Error Bot not exists '+ botId;
        throw (msg);
      }

      if (!dbResponce.Item.botTeam){
        const msg = 'BotConfigurator:GetBotTeam:Error BotTeam not exists '+ botId;
        throw (msg);
      }

      let result: BotGroupRoles = {
        admin: new Set<string>(),
        accountant: new Set<string>(),
        support: new Set<string>(),
        tutor: new Set<string>(),
        contentManager: new Set<string>()
      }      
      result = dbResponce.Item.botTeam;

      return result;
    }
    catch (error) {
      console.log(error);
      throw(error)
    }
  }  

  private static getDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set(
      [...setA].filter(element => !setB.has(element))
    );
  }  
  
  public static async UpdateBotRoles(botId: string, roleKey: EBotGroupRoles, newSet: Set<string>){
    try {

        const oldSet = await this.GetBotTeamByRole(botId, roleKey);
        const createItems = this.getDifference(newSet, oldSet);
        const deleteItems = this.getDifference(oldSet, newSet);

        for (const item of createItems){
          const botManager = await BotManager.GetOrCreate({chatId: item});
          await botManager.AppendNewBotRole(botId, roleKey);
        }

        for (const item of deleteItems){
          const botManager = await BotManager.GetOrCreate({chatId: item});
          await botManager.DeleteBotRole(botId, roleKey);
        }

        
          //BotManager.AppendNewRole()
          //для createItems нам нужно создать конфигурации botManager (если не существуют). Если существуют - добавить новое значение в bots через list_append
        
        //toDo

        //для deleteItems удалить уже созданные конфигурации botManager
      
      await ddbDocClient.update({
        TableName: process.env.botsTable!,
        Key: {
          PK: 'BOT#'+botId+"#CONFIGURATION",
          SK: 'CONFIGURATION',
        },
        UpdateExpression: "set #botTeam.#key = :value",
        ExpressionAttributeNames: {
          "#botTeam": "botTeam",
          "#key": roleKey.toString()
        },
        ExpressionAttributeValues: {
            ":value": newSet
        }        
        });     
    
    }
    catch (error) {
      console.log(error);
      throw(error)
    }
  }   
}