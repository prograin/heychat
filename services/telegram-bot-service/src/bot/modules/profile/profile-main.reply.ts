import { BotEvent } from "src/bot/types/bot-event.type";
import { KeyboardName } from "src/bot/buttons/keyboard.button";
import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import profileMe from "./profile-me.reply";
import editProfile from "./profile-edit.reply";

const profileMainReplyCallback = async (bot: TelegramBot, callbackQuery: CallbackQuery, response: BotResponse) => {
  const lastPart = response.callback?.data.parts.at(-1);

  switch (lastPart) {
    case "editOnTelegram":
      await editProfile(bot, callbackQuery.message as Message, response);
      break;
    case "me":
      await profileMe(bot, callbackQuery.message as Message, response);
      break;
  }
};

export const profileMainReplyMessage = async (bot: TelegramBot, message: Message, response: BotResponse) => {
  const keyboard = message.text;

  switch (keyboard) {
    case KeyboardName.ke_profile_n:
      await profileMe(bot, message, response);
      break;
  }
};

export default async (bot: TelegramBot, event: BotEvent, response: BotResponse) => {
  const chatId = "chat" in event ? event.chat.id : event.message?.chat.id;
  try {
    if ("data" in event) {
      await profileMainReplyCallback(bot, event, response);
    } else if ("text" in event) {
      await profileMainReplyMessage(bot, event, response);
    }
  } catch (error: any) {
    if (chatId) {
      await bot.sendMessage(
        chatId,
        error.response?.data?.message || error.message || "Something went wrong while processing your profile. Please try again."
      );
    }
  }
};
