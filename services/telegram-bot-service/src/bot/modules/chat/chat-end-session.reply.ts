import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { ChatSelfController } from "./chat.controller";
import { end_chat_partner_text, end_chat_user_text, no_partner_exists } from "./chat.text";
import { ma_main_ke } from "../start/start.markup";

async function chatEndSessionReply(bot: TelegramBot, message: Message, response: BotResponse) {
  if (response.user.has_session) {
    const callbackDataPart = response.callback!.data.parts;
    const partnerId = callbackDataPart[callbackDataPart.length - 2];

    if (response.user.partner.user_id != Number(partnerId)) {
      try {
        await bot.deleteMessage(message.chat.id, message.message_id);
      } catch {}
      return;
    }

    await ChatSelfController.updateSession(response.user.token as string, Number(response.user.partner.user_id), "ended");

    await bot.sendMessage(response.user.partner.chat_id!, end_chat_partner_text(response.user.profile!.username), {
      reply_markup: { keyboard: ma_main_ke.keyboard },
    });
    await bot.sendMessage(message.chat.id, end_chat_user_text, { reply_markup: { keyboard: ma_main_ke.keyboard } });
    return;
  } else {
    await bot.sendMessage(message.chat.id, no_partner_exists, { reply_markup: { keyboard: ma_main_ke.keyboard } });
  }
}

export default chatEndSessionReply;
