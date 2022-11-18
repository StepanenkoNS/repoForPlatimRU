import { handler } from '../../../services/SendMessages/queueIncomingMessages';


const event = 
{      
    "body": "{\"chat_id\":294728791,\n\"message\":{\"message_id\":561,\"from\":{\"id\":199163834,\"is_bot\":false,\"first_name\":\"Nick\",\"username\":\"LikeAHurricane\",\"language_code\":\"en\"},\"chat\":{\"id\":-735805591,\"title\":\"BotsGroupByNick\",\"type\":\"group\",\"all_members_are_administrators\":true},\"date\":1663071868,\"text\":\"/o\",\"entities\":[{\"offset\":0,\"length\":2,\"type\":\"bot_command\"}]}}",
    "isBase64Encoded": false
}

type a = "aaa" | "bbb" | "ccc";
async function main() {
    //console.log(JSON.parse(event.toString()));
    const key = "aaa";
    if (key in ["aaa","bbb"]){
        console.log(key);
    }

    //handler(event, {}, () => {});
    
}

main();