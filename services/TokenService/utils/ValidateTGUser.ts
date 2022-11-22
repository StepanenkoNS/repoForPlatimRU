import CryptoJS from "crypto-js";
import { TelegramUser } from "services/Utils/Types";

export function CleanupUser(
  user: any,
  removeHash: boolean = true
): TelegramUser {
  const u = { ...user };
  if (u.hasOwnProperty("hash") && removeHash === true) {
    delete u.hash;
  }

  if (u.hasOwnProperty("iat")) {
    delete u.iat;
  }
  if (u.hasOwnProperty("exp")) {
    delete u.exp;
  }
  if (u.hasOwnProperty("refreshToken")) {
    delete u.refreshToken;
  }
  console.log("u\n", JSON.stringify(u));
  return u as TelegramUser;
}

export function ValidateTelegramHash(user: any) {
  const { hash: userHash } = user;

  console.log("user\n", user);
  const _authData = CleanupUser(user as TelegramUser, true);
  console.log("_authData\n", JSON.stringify(_authData));
  const dataCheckArr = Object.keys(_authData)
    .map((key: string) => {
      const value = _authData[key as keyof typeof _authData];
      return `${key}=${[value]}`;
    })
    .sort()
    .join("\n");

  const secret_key = CryptoJS.SHA256(process.env.BOT_FATHER_TOKEN!);

  //const secret_key = CryptoJS.enc.Hex.parse(process.env.REACT_APP_BOT_FATHER_TOKEN_HASH!);
  const keyFromArray = CryptoJS.HmacSHA256(dataCheckArr, secret_key).toString();
  return keyFromArray === userHash;
}
