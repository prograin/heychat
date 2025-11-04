import TelegramBot, { Message, CallbackQuery } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { BotEvent } from "src/bot/types/bot-event.type";
import chatSendRequestReply from "./chat-send-request.reply";
import chatForwardMessageReply from "./chat-forward-message.reply";

const chatMainReplyMessage = async (bot: TelegramBot, message: Message, response: BotResponse) => {
  if (response.user.has_session) {
    await chatForwardMessageReply(bot, message, response);
    return;
  }
};

const chatMainReplyCallback = async (bot: TelegramBot, callbackQuery: CallbackQuery, response: BotResponse) => {
  const callbackDataPart = response.callback!.data.parts;
  const lastPart = callbackDataPart[callbackDataPart.length - 1];

  switch (lastPart) {
    case "send-request":
      await chatSendRequestReply(bot, callbackQuery, response.user, Number(callbackDataPart[callbackDataPart.length - 2]));
      break;
  }
};

export const chatMainReplyInit = async (bot: TelegramBot, event: BotEvent, response: BotResponse) => {
  const chatId = "chat" in event ? event.chat.id : event.message?.chat.id;

  try {
    if ("data" in event) {
      await chatMainReplyCallback(bot, event, response);
    } else if ("text" in event) {
      await chatMainReplyMessage(bot, event, response);
    }
  } catch (error) {
    if (chatId) {
      await bot.sendMessage(chatId, "Something went wrong while processing your chat. Please try again.");
    }

    if ("data" in event) {
      // await bot.answerCallbackQuery(event.id, { text: "An error occurred.", show_alert: true });
    }
  }
};

export default chatMainReplyInit;
