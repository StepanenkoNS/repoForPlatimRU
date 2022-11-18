
import { nanoid } from "services/Utils/Other/nanoid";
import { DDBObjectToMap } from "services/Utils/DDB/ddbObjectToMap";
import { ddbDocClient } from "services/Utils/DDB/ddbDocClient";
//@ts-ignore
import { CourseSubscriptionOption, ESubscriptionType, MarathonSubscriptionOption, Subscription, SubscriptionOption } from "/opt/SubscriptionTypes";

export class BotSubscriptionConfigurator{


    public static async GetBotSubscriptions(botId: string){
        const dbResponce = await ddbDocClient.query({
            TableName: process.env.botsTable!,
            KeyConditionExpression: "PK = :PK",
            ExpressionAttributeValues: {
                ":PK": 'BOT#'+botId+'#SUBSCRIPTION'
              },                
        });
        const map = new Map<string, Subscription>;
        if (dbResponce.Items) {
            for (const item of dbResponce.Items) { 
                map.set(item.SK,{
                    name: item.name,
                    type: item.type,
                    enabled: item.enabled,
                    options: item.options
                    })
            }
        }
        return map;
    }

    public static async GetBotSubscription(botId: string, subscriptionKey: string){
        try{
            const key = {
                'PK': 'BOT#'+botId+'#SUBSCRIPTION',
                'SK': subscriptionKey
                };
            const dbResponce = await ddbDocClient.get({
                Key: key,
                TableName: process.env.botsTable!
            })
            if (!dbResponce.Item) { 
                console.log('subscription not found\n BotId: ', botId, 'subscriptionKey: ', subscriptionKey);
                throw('BotSubscriptionConfigurator:GetBotSubscription Error - not found');
            }
            
            switch (dbResponce.Item.type){
                case ESubscriptionType.MARATHON: {
                    const options = DDBObjectToMap<MarathonSubscriptionOption>(dbResponce.Item.options);
                    const subscription : Subscription = {
                        name: dbResponce.Item.name,
                        type: dbResponce.Item.type,
                        enabled: dbResponce.Item.enabled,
                        options: options
                    }
                    return subscription;
                }
                case ESubscriptionType.SCHEDULED_COURSE: {
                    const options = DDBObjectToMap<CourseSubscriptionOption>(dbResponce.Item.options);
                    const subscription : Subscription = {
                        name: dbResponce.Item.name,
                        type: dbResponce.Item.type,
                        enabled: dbResponce.Item.enabled,
                        options: options
                    }
                    return subscription;
                }    
                case ESubscriptionType.FREE_COURSE: {
                    const options = DDBObjectToMap<CourseSubscriptionOption>(dbResponce.Item.options);
                    const subscription : Subscription = {
                        name: dbResponce.Item.name,
                        type: dbResponce.Item.type,
                        enabled: dbResponce.Item.enabled,
                        options: options
                    }
                    return subscription;
                }                                    
                
            }  

            throw('BotSubscriptionConfigurator:GetBotSubscription Error - ESubscriptionType not found');
        } catch (error){
            console.log(error);
            throw('BotSubscriptionConfigurator:GetBotSubscription Error - General');
        }
    }    

    public static async AddEmptySubscription(botId: string, subscriptionType: ESubscriptionType,  subscriptionName:string){
        try{
            //ReturnSubscriptionFromObject(params.subscriptionOptions);
            const subscription = {
                PK: 'BOT#'+botId+'#SUBSCRIPTION',
                SK: nanoid(),
                type: subscriptionType,
                name: subscriptionName,
                enabled: false,
                options: {}
            };
            await ddbDocClient.put({
                TableName: process.env.botsTable!,
                Item: subscription
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }        
    }

    public static async UpdateSubscriptionOption(botId: string, subscriptionKey: string,   option: SubscriptionOption, subscriptionOptionKey?: string){
        try{
            let optionKey = nanoid()
            if (subscriptionOptionKey) {
                optionKey = subscriptionOptionKey
            }

            const key = {
                'PK': 'BOT#'+botId+'#SUBSCRIPTION',
                'SK': subscriptionKey
                };
            const dbResponce = await ddbDocClient.get({
                Key: key,
                TableName: process.env.botsTable!
            });

            let map;  
            
            if (dbResponce.Item && dbResponce.Item.options){
                map = DDBObjectToMap<SubscriptionOption>(dbResponce.Item!.options)
            } else {
                map = new Map<string, SubscriptionOption>;
            }
            map.set(optionKey, option);


            
            const result = await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: {
                    PK: 'BOT#'+botId+'#SUBSCRIPTION',
                    SK: subscriptionKey
                },
                                
                UpdateExpression: "set #options = :value",
                ExpressionAttributeNames: {
                    '#options': 'options',
                },
                ExpressionAttributeValues: {
                    ':value': map
                },
                ReturnValues: "ALL_NEW"    
            });
            console.log(result);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }    

    public static async RenameSubscription(botId: string, SubscriptionKey: string, newSubscriptionName:string){
        try{
            await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: {
                    PK: 'BOT#'+botId+'#SUBSCRIPTION',
                    SK: SubscriptionKey
                },
                UpdateExpression: "set #name = :name ",
                ExpressionAttributeNames: {
                    '#name': 'name',
                },
                ExpressionAttributeValues: {
                    ":name": newSubscriptionName,
                }        
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }   

    public static async ActivateSubscription(botId: string, SubscriptionKey:string, enabled:boolean){
        try{
            await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: {
                    PK: 'BOT#'+botId+'#SUBSCRIPTION',
                    SK: SubscriptionKey
                },
                UpdateExpression: "SET enabled = :enabled",
                ExpressionAttributeValues: {
                    ':enabled': enabled,
                }     
            });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }  

    public async DeleteSubscription(botId: string, SubscriptionKey:string,){
        try{
            await ddbDocClient.delete({
                TableName: process.env.botsTable!,
                Key: {
                    PK: 'BOT#'+botId+'#SUBSCRIPTION',
                    SK: SubscriptionKey
                }    
                });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }  
    

    public static async DeleteSubscriptionOption(botId: string, subscriptionKey: string,  subscriptionOptionKey: string){
        try{


            const key = {
                'PK': 'BOT#'+botId+'#SUBSCRIPTION',
                'SK': subscriptionKey
                };
            const dbResponce = await ddbDocClient.get({
                Key: key,
                TableName: process.env.botsTable!
            });
            
            let map;  
            
            if (dbResponce.Item && dbResponce.Item.options){
                map = DDBObjectToMap<SubscriptionOption>(dbResponce.Item!.options)
            } else {
                map = new Map<string, SubscriptionOption>;
            }

            map.delete(subscriptionOptionKey);
            
            const result = await ddbDocClient.update({
                TableName: process.env.botsTable!,
                Key: {
                    PK: 'BOT#'+botId+'#SUBSCRIPTION',
                    SK: subscriptionKey
                },
                                
                UpdateExpression: "set #options = :value",
                ExpressionAttributeNames: {
                    '#options': 'options',
                },
                ExpressionAttributeValues: {
                    ':value': map
                },
                ReturnValues: "ALL_NEW"    
            });
            console.log(result);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }    
    
}