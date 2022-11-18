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

// services/TelegramFacingQueue/queueIncomingTelegramBotEvents.ts
var queueIncomingTelegramBotEvents_exports = {};
__export(queueIncomingTelegramBotEvents_exports, {
  queueIncomingTelegramBotEvents: () => queueIncomingTelegramBotEvents
});
module.exports = __toCommonJS(queueIncomingTelegramBotEvents_exports);

// services/TelegramFacingQueue/Utils/sqs.ts
var import_aws_sdk = require("aws-sdk");

// services/Utils/Other/nanoid.ts
var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
function nanoid(size = 14) {
  let id = "";
  let i = size;
  while (i >= 0) {
    id += urlAlphabet[Math.random() * 64 | 0];
    i--;
  }
  return id;
}

// services/TelegramFacingQueue/Utils/sqs.ts
var sqs = new import_aws_sdk.SQS({ region: process.env.region });
var incomingBotEvents_SQS = process.env.incomingBotEvents_SQS;
async function enqueueTelegramBotEvent(message) {
  const messageGroupId = "BOT#" + message.systemParameters.botFatherId + "#CHAT#" + message.systemParameters.chatId;
  const messageParams = {
    QueueUrl: incomingBotEvents_SQS,
    MessageBody: JSON.stringify(message),
    MessageDeduplicationId: nanoid(),
    MessageGroupId: messageGroupId
  };
  const result = await sqs.sendMessage(messageParams).promise();
  console.log(result);
  return result;
}

// services/TelegramFacingQueue/queueIncomingTelegramBotEvents.ts
async function queueIncomingTelegramBotEvents(event, context) {
  let body;
  if (!event) {
    const err = "Error: event is not defined";
    console.log(err);
    return {
      statusCode: 503,
      body: JSON.stringify(err),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
  if (!event.pathParameters || !event.pathParameters.proxy) {
    const err = "Error: pathParameters or pathParameters.proxy are empty ";
    console.log(err);
    return {
      statusCode: 503,
      body: JSON.stringify(err),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
  if (!event.pathParameters.proxy.match(/[0-9]+/)) {
    const err = "Error: bot not found in the event";
    console.log(err);
    return {
      statusCode: 503,
      body: JSON.stringify(err),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
  try {
    body = JSON.parse(event.body);
    console.log(body);
  } catch (error) {
    const err = "Error: mailformed body - invalid JSON object";
    console.log(err);
    return {
      statusCode: 503,
      body: JSON.stringify(err),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
  try {
    const incomingBotId = event.pathParameters.proxy;
    const botFatherId = incomingBotId.match(/[0-9]+/)[0];
    let bodyMessage;
    if (body.message) {
      bodyMessage = body.message;
    } else {
      if (body.callback_query) {
        bodyMessage = body.callback_query;
      }
    }
    const chatId = bodyMessage.from.id;
    const userName = bodyMessage.from.username;
    let menuLanguage = bodyMessage.from.language_code;
    if (botFatherId === void 0) {
      throw "botFather Id not defined";
    }
    ;
    if (chatId === void 0) {
      throw "ChatId is not defined";
    }
    ;
    const systemParams = {
      systemParameters: {
        botFatherId,
        chatId: chatId.toString(),
        userName,
        menuLanguage
      }
    };
    const messageToSend = { ...systemParams, ...body };
    console.log(JSON.stringify(messageToSend));
    await enqueueTelegramBotEvent(messageToSend);
    return {
      statusCode: 200,
      body: JSON.stringify({ Result: "Success" }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (error) {
    console.log("Error", JSON.stringify(error));
    return {
      statusCode: 503,
      body: JSON.stringify(error),
      headers: {
        "Content-Type": "application/json"
      }
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  queueIncomingTelegramBotEvents
});
