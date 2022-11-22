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
async function ListMyBotsHandler(event, context) {
  console.log(event);
  let origin = "https://zuzona.com";
  if (event.headers && event.headers.origin) {
    const array = process.env.allowedOrigins.split(",");
    if (array.includes(origin)) {
      origin = event.headers.origin;
    }
  }
  const returnObject = {
    statusCode: 200,
    body: JSON.stringify(""),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  };
  console.log("returnObject\n", returnObject);
  return returnObject;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ListMyBotsHandler
});
