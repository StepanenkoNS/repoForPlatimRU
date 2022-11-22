import { APIGatewayProxyResult, Context, APIGatewayEvent } from "aws-lambda";
import { ReturnResult } from "../utils/ReturnResult";
import { CreateNewTokens } from "../utils/GetNewToken";

export async function LambdaTokenServiceHandler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  if (!event) {
    const result = {
      error: "Error: event is not defined",
    };

    return ReturnResult(422, result, "*");
  }
  let origin = "https://zuzona.com";
  if (event.headers && event.headers.origin) {
    //todo - удалить перед деплоем
    const array = process.env.allowedOrigins!.split(",");
    if (array.includes(origin)) {
      origin = event.headers.origin;
    }
  }

  if (!event.requestContext || !event.requestContext.resourcePath) {
    const result = {
      error: "Error: event requestContext improperly  defined",
    };
    return ReturnResult(422, result, origin);
  }
  let bodyObject: any;
  try {
    bodyObject = JSON.parse(event.body!);
  } catch (error) {
    const result = {
      error: "Error: mailformed body - invalid JSON object",
    };
    return ReturnResult(422, result, origin);
  }

  try {
    const result = await CreateNewTokens(bodyObject, origin);
    return result;
  } catch (error) {
    const result = {
      error: "Error: CreateNewTokens failed",
    };
    return ReturnResult(422, result, origin);
  }
}
