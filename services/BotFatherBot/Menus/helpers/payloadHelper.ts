//этот хелпер обрабатывает payload
//так как ограничение 50 символов - я не могу нормально использовать JSON
//"{\"botId\":\"5129177159\",\"planKey\":\"Basic\"}" - здесь уже 51 символ
//B:5129177159,P:Premium - здесь всего 24
//B:5129177159,P:Premium,O:lifetime, - здесь всего 34
import { EBotGroupRoles } from "/opt/TelegramTypes";


export enum EPayloadKeys {
    //язык меню
    ML = <any>"menuLanguage",

    B  = <any>"botId",
        //subscritionKeys
        //P - ключ подписки
        S  = <any>"subscriptionKey",
            //O - ключ опции подписки
            SO  = <any>"subscriptionOptionKey",
        //PO - ключ платежной опции
        P = <any>"paymentOption",

        R = <any>"role",
}

export type PayloadType = {
    botId?: string,
    menuLanguage?: string,
    subscriptionKey?: string,
        subscriptionOptionKey?: string,
    paymentOption?: string,
    role?: EBotGroupRoles
}

export class PayloadHelper{ 
    public static ParsePayload(incomingPayload: string | (RegExpMatchArray & string)  | undefined, exlcludeKey?:EPayloadKeys){
        let returnObject : PayloadType = {};

        if (incomingPayload === undefined || incomingPayload.toString().trim()=='') {
            return returnObject;
        }
        //bot и menuLanguage - всегда идут первыми
        if (incomingPayload.match(/^B\:([^,]*)/)) {
            returnObject.botId = incomingPayload.match(/^B\:([^,]*)/)![1]
        }


        if (incomingPayload.match(/^ML\:([^,]*)/)) {
            returnObject.menuLanguage = incomingPayload.match(/^ML\:([^,]*)/)![1];
        }


        if (incomingPayload.match(/,R\:([^,]*)/)){
            const key = incomingPayload.match(/,R\:([^,]*)/)![1];
            returnObject.role = (key as unknown as EBotGroupRoles )            
        }   

        if (incomingPayload.match(/,S\:([^,]*)/)){
            returnObject.subscriptionKey = incomingPayload.match(/,S\:([^,]*)/)![1]
        }    

        if (incomingPayload.match(/,SO\:([^,]*)/)){
            returnObject.subscriptionOptionKey = incomingPayload.match(/,SO\:([^,]*)/)![1]
        }      

        if (incomingPayload.match(/,P\:([^,]*)/)){
            returnObject.paymentOption = incomingPayload.match(/,P\:([^,]*)/)![1]
        }           
        return returnObject;
    }

    public static StringifyPayload(obj: Object){
        let payload = '';

        for (const [key, value] of Object.entries(obj)) {
            if (!((<any>Object).values(EPayloadKeys).includes(key))) {
                throw('PayloadHelper:StringifyPayload:Error\nPayload key: '+key+' not found in EPayloadKeys');
            }
            const enumKey = Object.keys(EPayloadKeys)[Object.values(EPayloadKeys).indexOf(key)];
            payload = payload+enumKey+':'+value+',';
        }

        if (payload.length>=50){
            const error = 'PayloadHelper:StringifyPayload:Error Too long payload\n'+payload
            throw (error);
        }
        return payload;
    }

    // public static RemoveKeysFromPayload(incomingPayload: string, keys: string[]){
    //     const upperKeys = keys.map(element => {
    //         return element.toUpperCase();
    //       });

    //     let returnObject : PayloadType = {};
    //     if (incomingPayload === undefined || incomingPayload.toString().trim()=='') {
    //         return returnObject;
    //     }        
        
    //     //bot и menuLanguage - всегда идут первыми
    //     if (incomingPayload.match(/^B\:([^,]*)/) && !upperKeys.includes('B')) {
    //         returnObject.botId = incomingPayload.match(/^B\:([^,]*)/)![1]
    //     }


    //     if (incomingPayload.match(/^ML\:([^,]*)/) && !upperKeys.includes('ML')) {
    //         returnObject.menuLanguage = incomingPayload.match(/^ML\:([^,]*)/)![1];
    //     }


    //     if (incomingPayload.match(/,S\:([^,]*)/) && !upperKeys.includes('S')){
    //         returnObject.subscriptionKey = incomingPayload.match(/,S\:([^,]*)/)![1]
    //     }    

    //     if (incomingPayload.match(/,SO\:([^,]*)/) && !upperKeys.includes('SO')){
    //         returnObject.subscriptionOptionKey = incomingPayload.match(/,SO\:([^,]*)/)![1]
    //     }      

    //     if (incomingPayload.match(/,P\:([^,]*)/) && !upperKeys.includes(',P')){
    //         returnObject.paymentOption = incomingPayload.match(/,P\:([^,]*)/)![1]
    //     }           
    //     return returnObject;        
    // }

    public static KeepKeysInPayloadObject(incomingPayload: string, keys: string[]){
        const upperKeys = keys.map(element => {
            return element.toUpperCase();
          });

        let returnObject : PayloadType = {};
        if (incomingPayload === undefined || incomingPayload.toString().trim()=='') {
            return returnObject;
        }        
        
        //bot и menuLanguage - всегда идут первыми
        if (incomingPayload.match(/^B\:([^,]*)/) && upperKeys.includes('B')) {
            returnObject.botId = incomingPayload.match(/^B\:([^,]*)/)![1]
        }


        if (incomingPayload.match(/^ML\:([^,]*)/) && upperKeys.includes('ML')) {
            returnObject.menuLanguage = incomingPayload.match(/^ML\:([^,]*)/)![1];
        }

        if (incomingPayload.match(/,R\:([^,]*)/) && upperKeys.includes('R')){
            const key = incomingPayload.match(/,R\:([^,]*)/)![1];
            returnObject.role = (key as unknown as EBotGroupRoles )   
        }    

        if (incomingPayload.match(/,S\:([^,]*)/) && upperKeys.includes('S')){
            returnObject.subscriptionKey = incomingPayload.match(/,S\:([^,]*)/)![1]
        }    

        if (incomingPayload.match(/,SO\:([^,]*)/) && upperKeys.includes('SO')){
            returnObject.subscriptionOptionKey = incomingPayload.match(/,SO\:([^,]*)/)![1]
        }      

        if (incomingPayload.match(/,P\:([^,]*)/) && upperKeys.includes(',P')){
            returnObject.paymentOption = incomingPayload.match(/,P\:([^,]*)/)![1]
        }           
        return returnObject;
    }

    public static KeepKeysInPayload(incomingPayload: string, keys: string[]){
        return this.StringifyPayload(this.KeepKeysInPayloadObject(incomingPayload, keys));
    }

}