
import { App } from "aws-cdk-lib";
//import { RegisterBotAPIKeyStack } from "./APIKey/RegisterBotAPIKeyStack";
import { BotFatherTelegramFacingInfrastructureStack } from "./BotFatherTelegramFacingInfrastructure/BotFatherTelegramFacingInfrastructure";
//import { RegisterBotStack } from "./BotManagementAPI/RegisterBotStack";
import { MyBotFatherStack } from "./MyBotFatherBot/MyBotFatherBotStack";
//@ts-ignore
import * as StaticEnvironment from '../../ReadmeAndConfig/StaticEnvironment';



const app = new App();


const telegramFacingAPIandQueueStack = new BotFatherTelegramFacingInfrastructureStack(app, StaticEnvironment.StackName.BotFatherTelegramFacingStuff.toString(), {
    stackName: StaticEnvironment.StackName.BotFatherTelegramFacingStuff.toString(),
    redeployGateWayEachTime: false,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }    
})

const myBotFatherStack = new MyBotFatherStack(app, StaticEnvironment.StackName.BotFatherTheBot.toString(), {
    stackName: StaticEnvironment.StackName.BotFatherTheBot.toString(),
    incomingBotEventsSQS: telegramFacingAPIandQueueStack.incomingBotEvents_SQS,
    incomingBotEventsSQSdlq: telegramFacingAPIandQueueStack.incomingBotEvents_SQSdlq,
    env: {
        account: StaticEnvironment.GlobalAWSEnvironment.account,
        region: StaticEnvironment.GlobalAWSEnvironment.region
    }    
})






