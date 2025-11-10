import TelegramBot, { Message } from "node-telegram-bot-api";

import { ma_main_in, ma_main_ke } from "./start.markup";
import Response from "src/bot/types/bot-response.type";
import { UserAdminController } from "src/bot/modules/users/user.controller";
import axios from "axios";
import { BotEvent } from "src/bot/types/bot-event.type";
import { generateUserToken } from "src/api/utils/auth.util";
import { setUserToken } from "src/api/cache/auth.cache";
import { setMapTelegramToUser, setMapUserToTelegram } from "../users/user.cache";
import { inline_button_text, welcome_back_text, welcome_back_with_session_text, welcome_text } from "./start.text";
import { ma_accept_request_ke } from "../chat/chat.markup";

export default async (bot: TelegramBot, event: BotEvent, response: Response) => {
  const message = event as Message;

  const userTelegramId = message.from!.id;
  const chatId = message.chat.id;
  const { first_name: firstName } = message.chat;

  const usersTelegramData = {
    telegram_id: userTelegramId,
    telegram_chat_id: chatId,
  };

  try {
    if (response.user.exists) {
      // if (!response.user.profile) {
      //   await UserAdminController.createUser(usersTelegramData, true);
      // }

      if (response.user.has_session) {
        await bot.sendMessage(chatId, welcome_back_with_session_text(firstName), {
          parse_mode: "HTML",
          reply_markup: { keyboard: ma_accept_request_ke },
        });
      } else {
        await bot.sendMessage(chatId, welcome_back_text(firstName), { parse_mode: "HTML", reply_markup: ma_main_ke });
        await bot.sendMessage(chatId, inline_button_text, { parse_mode: "HTML", reply_markup: { inline_keyboard: ma_main_in.inline_keyboard } });
      }

      await setMapTelegramToUser(userTelegramId, Number(response.user.id));
      await setMapUserToTelegram(userTelegramId, Number(response.user.id));
    } else {
      const user = await UserAdminController.createUser(usersTelegramData);
      console.log(`🆕 User created: ${user.data.id}`);
      await bot.sendMessage(chatId, welcome_text(firstName), { parse_mode: "HTML", reply_markup: ma_main_ke });
      await bot.sendMessage(chatId, inline_button_text, { parse_mode: "HTML", reply_markup: { inline_keyboard: ma_main_in.inline_keyboard } });
      const token = await generateUserToken({
        user_id: user.data.id,
        telegram_id: userTelegramId,
        role: "user",
      });
      await setMapTelegramToUser(userTelegramId, Number(user.data.id));
      await setMapUserToTelegram(userTelegramId, Number(user.data.id));
      await setUserToken(user.data.id, token);
    }
  } catch (error: any) {
    console.error(error);
    if (axios.isAxiosError(error)) {
      console.error(`❌ Axios error: ${error.response?.status} → ${JSON.stringify(error.response?.data) || error.message}`);
    } else {
      console.error(`❌ Unexpected error:`, error);
    }
  }
};
