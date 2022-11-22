import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import ReturnRestApiResult from "services/Utils/ReturnRestApiResult";
import { TelegramUserFromAuthorizer } from "services/Utils/Types";
//@ts-ignore
import BotManager from "/opt/BotManager";

export async function ListMyBotsHandler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.log(event);

  let origin = "https://" + process.env.cookieDomain;
  if (event.headers && event.headers.origin) {
    //todo - удалить перед деплоем
    const array = process.env.allowedOrigins!.split(",");
    if (array.includes(origin)) {
      origin = event.headers.origin;
    }
  }

  const telegramUser = event.requestContext
    .authorizer as TelegramUserFromAuthorizer;

  const botManager = await BotManager.GetOrCreate({
    chatId: telegramUser.id,
    userName: telegramUser.username,
  });

  botManager.GetMyBots();
  const returnObject = ReturnRestApiResult(
    200,
    { templateData: "template" },
    origin
  );

  console.log("returnObject\n", returnObject);
  return returnObject as APIGatewayProxyResult;
}
