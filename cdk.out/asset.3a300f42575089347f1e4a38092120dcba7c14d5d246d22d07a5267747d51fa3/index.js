"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// services/Bots/ListMyBots.ts
var ListMyBots_exports = {};
__export(ListMyBots_exports, {
  ListMyBotsHandler: () => ListMyBotsHandler
});
module.exports = __toCommonJS(ListMyBots_exports);

// services/Utils/ReturnRestApiResult.ts
function ReturnResult(statusCode, messageBody, origin, renewedAccessToken) {
  let accessTokenCookie = "";
  if (renewedAccessToken) {
    const accessTokenExpirationDate = new Date();
    accessTokenExpirationDate.setTime(
      new Date().getTime() + 1e3 * Number(process.env.accessTokenExpirationMinutes) * 60
    );
    accessTokenCookie = "accessToken=" + renewedAccessToken + "; Expires=" + accessTokenExpirationDate.toUTCString() + "; Secure; SameSite=None; Domain=." + process.env.cookieDomain + "; Path=/";
  }
  const returnObject = {
    statusCode,
    body: JSON.stringify(messageBody),
    multiValueHeaders: {
      "Set-Cookie": [accessTokenCookie]
    },
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  };
  console.log("returnObject\n", JSON.stringify(returnObject));
  return returnObject;
}

// services/Bots/ListMyBots.ts
async function ListMyBotsHandler(event, context) {
  console.log(event);
  let origin = "https://" + process.env.cookieDomain;
  if (event.headers && event.headers.origin) {
    const array = process.env.allowedOrigins.split(",");
    console.log("origin from headers\n", event.headers.origin);
    console.log("array\n", array);
    if (array.includes(origin)) {
      origin = event.headers.origin;
    }
  }
  console.log("final origin\n", origin);
  const returnObject = ReturnResult(
    200,
    { templateData: "template" },
    origin
  );
  console.log("returnObject\n", returnObject);
  return returnObject;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ListMyBotsHandler
});
