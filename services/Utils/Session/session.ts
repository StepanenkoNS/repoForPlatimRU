
import {ddbDocClient} from "../DDB/ddbDocClient";

export interface ISessionOptions {
  property: string,
  sessionTTL: number,
  botId: string,
  chatId: string, 
  dynamoDBConfig: {
    params: {
        TableName: string
    },
    region: string
}

}
interface IUpdateExpression {
  UpdateExpression: string,
  ExpressionAttributeNames: {[key: string]: any},
  ExpressionAttributeValues: {[key: string]: any}
}

export class DynamoDBSession {
    private sessionOptions: ISessionOptions;
    private sessionKey: string;
    
    constructor (options: ISessionOptions) {
        this.sessionOptions = Object.assign({
            property: 'session',
            botId: '',
            chatId: '',
            sessionTTL: -1, // minutes, -1 for never expired
            dynamoDBConfig: {
                params: {
                    TableName: 'telegrafSessions' // override this value to your table
                },
                region: process.env.region! // override this value to your region
            }
        }, options);
        this.sessionKey = 'BOT#'+this.sessionOptions.botId+'#USER#'+this.sessionOptions.chatId+"#SESSION";
  }

  // private getSessionKey(ctx:any):string{
  //   //ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`
  //   const sessionKey = 'BOT#'+this.sessionOptions.botId+
  //                     '#USER#'+ctx.chat.id+"#SESSION";
  //   return sessionKey;
  // }

  public async createSession (key:string) {

    const item = {
      SessionKey: key,
      SessionValue: {},
      sessionTTL: this.sessionOptions.sessionTTL

    }
    await ddbDocClient.put({
        TableName:   this.sessionOptions.dynamoDBConfig.params.TableName,
        Item: item
        });  


    return item;
  }

  public async getCurrentSession(){
    return await this.getSession(this.sessionKey);
  }
  public async getSession (key:string) {
    const dbResponce = await ddbDocClient.get({
        Key: {
          SessionKey: key
        },
        TableName:  this.sessionOptions.dynamoDBConfig.params.TableName
      })      
      
      if (!dbResponce.Item) { 
        const result = await this.createSession(key);
        return result;
       } else {
       return dbResponce.Item;
       }
  }



  private  generateUpdateQuery(fields: any):IUpdateExpression {
    let exp : IUpdateExpression = {
      UpdateExpression: "set ",
      ExpressionAttributeNames: {},
      ExpressionAttributeValues: {}
    };

    for (const [key, item] of  Object.entries(fields)) { 
      if (key != 'SessionKey') {    
        const escapedKey = key.toString().replace('\p{L}', '').replace(/_/g, '');
        if (!(escapedKey in exp.ExpressionAttributeNames)) {
          exp.UpdateExpression += ` #${escapedKey} = :${escapedKey},`;
          exp.ExpressionAttributeNames[`#${escapedKey}`] = key;
          exp.ExpressionAttributeValues[`:${escapedKey}`] = item;
        }
      }
    }

    // Object.entries(fields).forEach(([key, item]) => {
    //   if (key != 'SessionKey') {    
    //     const escapedKey = key.toString().replace('\p{L}', '').replace(/_/g, '');
    //     if (!(escapedKey in exp.ExpressionAttributeNames)) {
    //       exp.UpdateExpression += ` #${escapedKey} = :${escapedKey},`;
    //       exp.ExpressionAttributeNames[`#${escapedKey}`] = key;
    //       exp.ExpressionAttributeValues[`:${escapedKey}`] = item;
    //   }
    //   }
    // })    
    exp.UpdateExpression = exp.UpdateExpression.slice(0, -1);
    return exp;
}


  async saveSession (key:string, session:any) {
    if (!session || Object.keys(session).length === 0) {
      await this.clearSession(key)
    }

    const sessionTTL = this.sessionOptions.sessionTTL == -1 ? -1 : Math.floor(Date.now() / 1000) + this.sessionOptions.sessionTTL * 60;
    

    let data = session;
    let expression = this.generateUpdateQuery(data);
    if (!('#sessionTTL' in expression.ExpressionAttributeNames)) {
    expression.UpdateExpression +=  ', #sessionTTL = :sessionTTL';
    expression.ExpressionAttributeNames[`#sessionTTL`] = 'sessionTTL';
    expression.ExpressionAttributeValues[':sessionTTL'] = sessionTTL;
  } else {
    expression.ExpressionAttributeValues[':sessionTTL'] = sessionTTL;
  }
  try {
    await ddbDocClient.update({
        TableName:this.sessionOptions.dynamoDBConfig.params.TableName,
        Key: {
          SessionKey: key
        },
        UpdateExpression: expression.UpdateExpression,
        ExpressionAttributeNames: expression.ExpressionAttributeNames,
        ExpressionAttributeValues: expression.ExpressionAttributeValues
        });    
    console.log('success');
      } catch (error) {
        console.log(error);
        throw(error);
      }
  }

  public async clearSession (key:string ) {
    await ddbDocClient.delete({
        TableName:this.sessionOptions.dynamoDBConfig.params.TableName,
        Key: {
          SessionKey: key
        },
    });

  }

  public  middleware () {

    return async (ctx:any, next:any) => {
      const key = await this.sessionKey
      if (!key) {
        return next()
      }
      let session = await this.getSession(key);
      if (session) {
        await Object.defineProperty(ctx, this.sessionOptions.property, {
          get: function () {return session},
          set: function (newValue) {session = Object.assign({}, newValue)}
        });
        await this.saveSession(key, session);
        return next();
      }   
    }
  }
}
