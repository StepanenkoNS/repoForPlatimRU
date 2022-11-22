import * as jwt from "jsonwebtoken";
import { RefreshTokenFromCookie } from "../utils/RefreshToken";
import { TelegramUserProfile } from "../utils/Types";
import { AWSPolicyGenerator } from "../utils/AWSPolicyGenerator";

function getTokenFromCookes(cookies: string) {
  const accessToken = cookies.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === "accessToken" ? decodeURIComponent(parts[1]) : r;
  }, "");

  const refreshToken = cookies.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === "refreshToken" ? decodeURIComponent(parts[1]) : r;
  }, "");

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
}

export async function LambdaJWTAuthorizerHandler(
  event: any,
  context: any,
  callback: any
) {
  console.log("event\n", event);
  if (!event.headers || !event.headers.cookie) {
    console.log("Cookies not provided");
    //throw new Error("Unauthorized");
    return AWSPolicyGenerator.generate("undefined", "Deny", event.methodArn);
  }
  const tokensFromCookies = getTokenFromCookes(event.headers.cookie);

  console.log("tokensFromCookies\n", JSON.stringify(tokensFromCookies));

  if (
    tokensFromCookies.refreshToken == undefined ||
    tokensFromCookies.refreshToken == ""
  ) {
    //throw new Error("Unauthorized");
    return AWSPolicyGenerator.generate("undefined", "Deny", event.methodArn);
  }
  let accessToken: string | undefined = tokensFromCookies.accessToken;
  let renewAccessToken: boolean = false;
  if (accessToken == undefined || accessToken == "") {
    //выпускаем новый accessToken
    accessToken = RefreshTokenFromCookie(tokensFromCookies.refreshToken);
    console.log("new access token has been issued\n", accessToken);
    renewAccessToken: true;
    if (!accessToken) {
      //throw new Error("Unauthorized");
      return AWSPolicyGenerator.generate("undefined", "Deny", event.methodArn);
    }
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.BOT_FATHER_TOKEN!, {
      algorithms: ["HS256"],
    });
    const userProfile: TelegramUserProfile = {
      id: (decoded as TelegramUserProfile).id,
      first_name: (decoded as TelegramUserProfile).first_name,
      last_name: (decoded as TelegramUserProfile).last_name,
      photo_url: (decoded as TelegramUserProfile).photo_url,
      username: (decoded as TelegramUserProfile).username,
      language: (decoded as TelegramUserProfile).language,
    };

    let responseContext = {
      ...userProfile,

      //      refreshToken: tokensFromCookies.refreshToken,
    };
    if (renewAccessToken) {
      responseContext = {
        ...{ renewedAccessToken: accessToken },
        ...responseContext,
      };
    }
    const result = AWSPolicyGenerator.generate(
      userProfile.id.toString(),
      "Allow",
      event.methodArn,
      responseContext
    );
    return result;
  } catch (error) {
    console.log("LambdaJWTAuthorizerHandler\n", error);
    //*********
    //throw new Error("Unauthorized");
    return AWSPolicyGenerator.generate("undefined", "Deny", event.methodArn);
  }
}
