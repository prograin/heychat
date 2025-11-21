import { BotEvent } from "src/bot/types/bot-event.type";
import { KeyboardName } from "src/bot/buttons/keyboard.button";
import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import profileMe from "./profile-me.reply";
import editProfile from "./profile-edit.reply";
import cancelEditProfile from "./profile-cancel-edit.reply";

const profileMainReplyCallback = async (bot: TelegramBot, callbackQuery: CallbackQuery, response: BotResponse) => {
  const lastPart = response.callback?.data.parts.at(-1);

  if (response.edit_profile.isActive) {
    if (lastPart == "cancelEditProfile") {
      await cancelEditProfile(bot, callbackQuery.message as Message, response, true, true);
    } else {
      await editProfile(bot, callbackQuery.message as Message, response);
    }
    return;
  }

  switch (lastPart) {
    case "editOnTelegram":
      await editProfile(bot, callbackQuery.message as Message, response);
      break;
    case "cancelEditProfile":
      await cancelEditProfile(bot, callbackQuery.message as Message, response, true, true);
      break;
    case "me":
      await profileMe(bot, callbackQuery.message as Message, response);
      break;
  }
};

export const profileMainReplyMessage = async (bot: TelegramBot, message: Message, response: BotResponse) => {
  const keyboard = message.text;

  if (response.edit_profile.isActive) {
    if (keyboard == KeyboardName.ke_cancel_edit_profile_n) {
      await cancelEditProfile(bot, message as Message, response, false, false);
    } else {
      await editProfile(bot, message as Message, response);
    }
    return;
  }

  switch (keyboard) {
    case KeyboardName.ke_profile_n:
      await profileMe(bot, message, response);
      break;

    case KeyboardName.ke_cancel_edit_profile_n:
      await cancelEditProfile(bot, message, response, false, false);
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
