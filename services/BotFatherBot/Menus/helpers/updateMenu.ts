import { MyContext } from "/opt/TelegramTypes";


export async function UpdateMenu(ctx:MyContext, text: string){
    try{  
        if (ctx.msg && ctx.msg.text && ctx.msg.text !== text){
            await ctx.editMessageText(text, {parse_mode: 'HTML'}); 
        }
          
    } catch (error){
        console.log('UpdateMenu\n',error)
    }
}     