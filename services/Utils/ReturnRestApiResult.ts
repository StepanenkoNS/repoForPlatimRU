import { APIGatewayProxyResult } from "aws-lambda";

export default function ReturnRestApiResult(
  statusCode: number,
  data: any,
  origin: string,
  renewedAccessToken?: string
) {
  let accessTokenCookie = "";
  if (renewedAccessToken) {
    const accessTokenExpirationDate = new Date();
    accessTokenExpirationDate.setTime(
      new Date().getTime() +
        1000 * Number(process.env.accessTokenExpirationMinutes!) * 60
    );

    accessTokenCookie =
      "accessToken=" +
      renewedAccessToken +
      "; Expires=" +
      accessTokenExpirationDate.toUTCString() +
      "; Secure; SameSite=None; Domain=." +
      process.env.cookieDomain! +
      "; Path=/";
  }

  const returnObject = {
    statusCode: statusCode,
    body: JSON.stringify(data),
    multiValueHeaders: {
      "Set-Cookie": [accessTokenCookie],
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin, // Required for CORS support to work
      "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  };
  console.log("returnObject\n", JSON.stringify(returnObject));
  return returnObject as APIGatewayProxyResult;
}
