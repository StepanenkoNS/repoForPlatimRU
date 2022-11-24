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

// services/WebPages/GetWebPageData.ts
var GetWebPageData_exports = {};
__export(GetWebPageData_exports, {
  GetWebPageDataHandler: () => GetWebPageDataHandler
});
module.exports = __toCommonJS(GetWebPageData_exports);

// services/Utils/ReturnRestApiResult.ts
function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries())
    };
  } else {
    return value;
  }
}
function ReturnRestApiResult(statusCode, data, origin, renewedAccessToken) {
  let accessTokenCookie = "";
  if (renewedAccessToken) {
    const accessTokenExpirationDate = new Date();
    accessTokenExpirationDate.setTime(new Date().getTime() + 1e3 * Number(process.env.accessTokenExpirationMinutes) * 60);
    accessTokenCookie = "accessToken=" + renewedAccessToken + "; Expires=" + accessTokenExpirationDate.toUTCString() + "; Secure; SameSite=None; Domain=." + process.env.cookieDomain + "; Path=/";
  }
  let returnObject = {
    statusCode,
    body: JSON.stringify(data, replacer),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  };
  if (renewedAccessToken) {
    returnObject = {
      ...{
        multiValueHeaders: {
          "Set-Cookie": [accessTokenCookie]
        }
      },
      ...returnObject
    };
  }
  return returnObject;
}

// services/WebPages/GetWebPageData.ts
var import_ddbDocClient = require("/opt/DDB/ddbDocClient");
var import_ConfiguratorTypes = require("/opt/ConfiguratorTypes");
var fallbackLocale = import_ConfiguratorTypes.defaultMenuLanguage;
async function GetWebPageDataHandler(event, context) {
  console.log(event);
  let origin = "https://" + process.env.cookieDomain;
  if (event.headers && event.headers.origin) {
    const array = process.env.allowedOrigins.split(",");
    if (array.includes(origin)) {
      origin = event.headers.origin;
    }
  }
  if (!event.body) {
    console.log("body not provided");
    const returnObject = ReturnRestApiResult(422, { error: "body not provided" }, origin);
    return returnObject;
  }
  try {
    const body = JSON.parse(event.body);
    if (!body.pagePath) {
      const returnObject = ReturnRestApiResult(422, { error: "pagePath not provided" }, origin);
      return returnObject;
    }
    let locale = !body.locale ? fallbackLocale : body.locale;
    try {
      const dbResponce = await import_ddbDocClient.ddbDocClient.query({
        TableName: process.env.webTable,
        KeyConditionExpression: "PK = :PK AND SK begins_with :SK_PREFIX",
        ExpressionAttributeValues: {
          ":PK": "PATH#" + body.pagePath.toLowerCase() + "#LOCALE#" + locale.toLowerCase(),
          ":SK_PREFIX": "ITEMID#"
        }
      });
      const map = /* @__PURE__ */ new Map();
      if (dbResponce.Items) {
        for (const item of dbResponce.Items) {
          const x = { ...item };
          if (x.hasOwnProperty("PK")) {
            delete x.PK;
          }
          if (x.hasOwnProperty("SK")) {
            delete x.SK;
          }
          map.set(item.SK.replace("ITEMID#", ""), x);
        }
      } else {
        console.log("no items returned from DDBQuery");
      }
      const returnObject = ReturnRestApiResult(200, map, origin);
      return returnObject;
    } catch (error) {
      console.log("DynamoDB error\n", error);
      const returnObject = ReturnRestApiResult(422, { error: "Database error" }, origin);
      return returnObject;
    }
  } catch (error) {
    console.log("error: Body is not in JSON");
    const returnObject = ReturnRestApiResult(422, { error: "Body is not in JSON" }, origin);
    return returnObject;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetWebPageDataHandler
});
