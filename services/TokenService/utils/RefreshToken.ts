import * as jwt from "jsonwebtoken";
import { TelegramUserProfile } from "./Types";
export function RefreshTokenFromCookie(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.BOT_FATHER_TOKEN!, {
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
    const accessToken = jwt.sign(userProfile, process.env.BOT_FATHER_TOKEN!, {
      algorithm: "HS256",
      expiresIn: process.env.accessTokenExpirationMinutes! + " minutes",
    });
    return accessToken;
  } catch (error) {
    console.log("RefreshTokenFromCookieError\n", error);
    return undefined;
  }
}
