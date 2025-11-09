import TelegramBot, { Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";

import { no_partner_exists, warning_end_chat } from "./chat.text";
import { ma_main_ke } from "../start/start.markup";
import { ma_warning_end_chat_in } from "./chat.markup";

async function chatEndWarningSessionReply(bot: TelegramBot, message: Message, response: BotResponse) {
  if (response.user.has_session) {
    await bot.sendMessage(message.chat.id, warning_end_chat, {
      reply_markup: { inline_keyboard: ma_warning_end_chat_in(String(response.user.partner.user_id)) },
    });
    return;
  } else {
    await bot.sendMessage(message.chat.id, no_partner_exists, { reply_markup: { keyboard: ma_main_ke.keyboard } });
  }
}

export default chatEndWarningSessionReply;
