

import { stringMap } from "aws-sdk/clients/backup";
import { DDBObjectToMap } from "../../Utils/DDB/ddbObjectToMap";
import { ddbDocClient } from "../../Utils/DDB/ddbDocClient";
import { BotConfigurator } from "./BotConfigurator";
//@ts-ignore
import { defaultMenuLanguage, IBotManager, IInitBotManager } from "/opt/ConfiguratorTypes";
import { BotGroupRoles, EBotGroupRoles } from "/opt/TelegramTypes";




export class BotManager{
    private botManagerProperties: IBotManager;

    public static async GetOrCreate(params: IInitBotManager){
        const botManager = new this(params);
        await botManager.Init(params);
        return botManager;
    }

    public getChatId(){
        return this.botManagerProperties.chatId;
    }    
    public GetMyBots(roleKey?:EBotGroupRoles){
        if (!roleKey) {return this.botManagerProperties.bots;}
        const filteredMap = new Map<string, BotGroupRoles>;

        for (const bot of this.botManagerProperties.bots){
            const typedKey = (roleKey.toString() as keyof typeof bot[1] );
            if ( bot[1][typedKey].has(this.botManagerProperties.chatId)) {
                filteredMap.set(bot[0], bot[1]);
            }
        }
        return filteredMap;
    }


    public GetMyRolesInTheBot(botId: string){
        const result: EBotGroupRoles[] = [];

        const bot = this.botManagerProperties.bots.get(botId);
        if (!bot){
            throw ('GetMyRolesInTheBot:Error - bot not found');
        }

        for (const key of Object.keys(bot)){
            if (bot[key as keyof typeof bot].has(this.botManagerProperties.chatId)){
                let typedKey = key.toString() as keyof typeof EBotGroupRoles;
                result.push(EBotGroupRoles[typedKey]);
            }
        }
        //возвращаем список групп
        return result;
    }

    private async Init(incomingParams: IInitBotManager){
        if (await this.InitExistingBotManager(incomingParams)){
            return;
        }
        await this.CreateNewBotManager();
            //если не нашелся - создаем нового и инициализируем поля
    }

    private async InitExistingBotManager(incomingParams: IInitBotManager){
        try{
            const key = {
                'PK': 'BOTMANAGER#'+process.env.botFatherId,
                'SK': 'USERCONFIGURATION#'+incomingParams.chatId
                };
            const dbResponce = await ddbDocClient.get({
                Key: key,
                TableName: process.env.botsTable!
            })
            if (!dbResponce.Item) { 
                return false;
            }
            this.botManagerProperties.createdAt = dbResponce.Item.createdAt;
            this.botManagerProperties.userName = dbResponce.Item.userName;
            this.botManagerProperties.menuLanguage = dbResponce.Item.menuLanguage;
            this.botManagerProperties.bots = DDBObjectToMap(dbResponce.Item.bots);
            this.botManagerProperties.channels = dbResponce.Item.channels;

            if ((incomingParams.userName) && (this.botManagerProperties.userName != incomingParams.userName)) {
                this.botManagerProperties.userName = incomingParams.userName;
                await this.UpdateExistingBotManageDB_userName(); 
            }            
            return true;
        } catch (error){
            console.log(error);
            throw('BotManager:InitExistingBotManager Error');
        }
    }

    private async CreateNewBotManager(){
        try{
            const putItem = {
                'PK': 'BOTMANAGER#'+process.env.botFatherId,
                'SK': 'USERCONFIGURATION#'+this.botManagerProperties.chatId,
                userName: this.botManagerProperties.userName,
                createdAt: new Date().toISOString(),
                menuLanguage: this.botManagerProperties.menuLanguage,
                bots: this.botManagerProperties.bots,
                channels: this.botManagerProperties.channels
            }      
            await ddbDocClient.put({
                TableName: process.env.botsTable!,
                Item: putItem
            });

            this.botManagerProperties.createdAt = putItem.createdAt;
        } catch (error){
            console.log(error);
            throw(error);
        }
    }    

    private async UpdateExistingBotManageDB_userName(){
        try{
            await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: {
                    'PK': 'BOTMANAGER#'+ process.env.botFatherId,
                    'SK': 'USERCONFIGURATION#'+this.botManagerProperties.chatId,
                },
                UpdateExpression: "set userName = :userName",
                ExpressionAttributeValues: {
                    ":userName": this.botManagerProperties.userName,
                }        
                });
        } catch (error){
            console.log(error);
            throw(error);
        }
    } 

    private async UpdateExistingBotManageDB_bots(){
        try{
            await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: {
                    'PK': 'BOTMANAGER#'+ process.env.botFatherId!,
                    'SK': 'USERCONFIGURATION#'+this.botManagerProperties.chatId,
                },
                UpdateExpression: "set bots = :bots",
                ExpressionAttributeValues: {
                    ":bots": this.botManagerProperties.bots,
                }        
                });
        } catch (error){
            console.log(error);
            throw(error);
        }
    }     

    private constructor(params: IInitBotManager){      
        this.botManagerProperties = {
            chatId: params.chatId,
            userName: params.userName,
            menuLanguage: defaultMenuLanguage,
            bots:new Map<string, BotGroupRoles>,
            channels: {}
        }
    }

    public UserName(): string | undefined {
        if (!this.botManagerProperties.userName ||
            this.botManagerProperties.userName == '' ){
                return undefined;
            }
        return this.botManagerProperties.userName;
    }

    public GetBotManagerMenuLanguage(){
        if (!this.botManagerProperties.menuLanguage) {
            this.botManagerProperties.menuLanguage = defaultMenuLanguage;
        } 
        return this.botManagerProperties.menuLanguage
    }  

    public async ChangeBotManagerMenuLanguage(newLanguage: string){
        try{
            const key = {
                'PK': 'BOTMANAGER#'+ process.env.botFatherId,
                'SK': 'USERCONFIGURATION#'+this.botManagerProperties.chatId,
            };
            const result = await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: key,
                UpdateExpression: "set menuLanguage = :menuLanguage",
                ExpressionAttributeValues: {
                    ":menuLanguage": newLanguage
                }
                });
            this.botManagerProperties.menuLanguage = newLanguage;
        } catch (error){
            console.log(error);
            throw('ChatConfigurator:UpdateUserMenuLanguage error');
        }
    } 
    
    public async RegisterNewBot(botToken: string){
        const match =botToken.match(/^.+[0-9]?(?=:)/);
        const botId = match![0];
        const adminSet = new Set<string>();
        adminSet.add(this.botManagerProperties.chatId)
        await BotConfigurator.CreateNewBot({
            botId: botId,
            botTeam: {
                admin: adminSet,
                accountant: new Set<string>(),
                support: new Set<string>(),
                tutor: new Set<string>(),
                contentManager: new Set<string>()
            },
            defaultLanguage: 'ru',
            additionalLanguages: []
        }, botToken);
        //проверяем - есть ли такой бот в конфиге менеджера
        if (this.botManagerProperties.bots.has(botId)){
            // если есть - добавляем пользователя в роль
            const botTeam = this.botManagerProperties.bots.get(botId);
            botTeam?.admin.add(this.botManagerProperties.chatId);
            this.botManagerProperties.bots.set(botId, botTeam!);
        } else {
            // если нет - создаем новую запись в bots
            const adminSet = new Set<string>();
            adminSet.add(this.botManagerProperties.chatId)
            const botTeam: BotGroupRoles = {
                admin: adminSet,
                accountant: new Set<string>(),
                support: new Set<string>(),
                tutor: new Set<string>(), 
                contentManager: new Set<string>()            
            };
            this.botManagerProperties.bots.set(botId, botTeam!);            
        }
        await this.UpdateExistingBotManageDB_bots();
    }

    public async AppendNewBotRole(botId: string, roleKey:EBotGroupRoles){

        //проверяем - есть ли такой бот в конфиге менеджера        
        if (this.botManagerProperties.bots.has(botId)){
            const botTeam = this.botManagerProperties.bots.get(botId)!;
            // если есть - добавляем админа
            const typedKey = roleKey.toString() as keyof typeof botTeam;
            //так как set - добавляем запись в сет только если не существует
            if (botTeam![typedKey] == null) {
                botTeam![typedKey] = new Set<string>();
            }
            if (!(botTeam![typedKey].has(this.botManagerProperties.chatId))) {
                botTeam![typedKey].add(this.botManagerProperties.chatId);
            }
            this.botManagerProperties.bots.set(botId, botTeam);

        } else {
            const newSet = new Set<string>();
            newSet.add(this.botManagerProperties.chatId)
            const botTeam: BotGroupRoles = {
                admin: new Set<string>,
                accountant: new Set<string>(),
                support: new Set<string>(),
                tutor: new Set<string>(), 
                contentManager: new Set<string>()            
            };

            const typedKey = roleKey.toString() as keyof typeof botTeam;
            //так как set - добавляем только если не существует
            if (botTeam![typedKey] == null) {
                botTeam![typedKey] = new Set<string>();
            }            
            if (!(botTeam![typedKey].has(this.botManagerProperties.chatId))) {
                botTeam![typedKey].add(this.botManagerProperties.chatId);
            }            
            this.botManagerProperties.bots.set(botId, botTeam!);            
        }       
        await this.UpdateExistingBotManageDB_bots(); 
    }    

    public async DeleteBotRole(botId: string, roleKey:EBotGroupRoles){

        //проверяем - есть ли такой бот в конфиге менеджера   
        if (this.botManagerProperties.bots.has(botId)){
            const botTeam = this.botManagerProperties.bots.get(botId)!;
            // если есть - удаляем пользователя
            const typedKey = roleKey.toString() as keyof typeof botTeam;
            if (botTeam![typedKey] == null) {
                botTeam![typedKey] = new Set<string>();
            }               
            //так как set - добавляем запись в сет только если не существует
            if (botTeam![typedKey].has(this.botManagerProperties.chatId)) {
                botTeam![typedKey].delete(this.botManagerProperties.chatId);
            }
            this.botManagerProperties.bots.set(botId, botTeam);

        } else {
            //если нет - то ничего и не делаем, кроме логов
            console.log("BotConfigurator:DeleteBotRole:ErrorInfo "+this.botManagerProperties.chatId+"does not have "+botId+" in its configuration");
        }
        await this.UpdateExistingBotManageDB_bots(); 
    }        

}