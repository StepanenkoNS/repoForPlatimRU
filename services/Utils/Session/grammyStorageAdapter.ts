import {ddbDocClient} from "../DDB/ddbDocClient";

export interface ISession {
    key: string;
    value: unknown;
}

export class DynamoDBAdapter {
    private botId: string;
    private chatId: string;
    private sessionKey?: string;

    private tableName : string;
    constructor(botId:string, chatId: string, tableName:string) {
        this.botId = botId;
        this.chatId = chatId;
        this.sessionKey =  'BOT#'+botId+'#USER#'+chatId+"#SESSION";
        this.tableName = tableName;
    }
    public async read(key: string) {
        const dbResponce = await ddbDocClient.get({
            Key: {
                SessionKey: this.sessionKey
            },
            TableName:  this.tableName
        });
        if (dbResponce.Item) { 
            const session = dbResponce.Item;
            return session.value;
        } else {
            return undefined;
        }
    }

    public async write(key:string, data:any) {
        const item = {
            SessionKey: this.sessionKey,
            value: data,
            updateAt: new Date().toISOString()
        };
        try {  
            await ddbDocClient.put({
                TableName:   this.tableName,
                Item: item
            });
        } catch (error){
            console.log(error);
            throw(error);
        }        
    }
    public async delete(key:string) {
        try {         
            await ddbDocClient.delete({
                TableName:this.tableName,
                Key: {
                    SessionKey: this.sessionKey
                },
            });
        } catch (error){
            console.log(error);
            throw(error);
        }  
    }
}
