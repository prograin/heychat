import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { ma_accept_request_ke } from "./chat.markup";

async function chatForwardMessageReply(bot: TelegramBot, message: Message, response: BotResponse) {
  const messageId = message.message_id;
  const fromChatId = message.chat.id;
  const partnerChatId = response.user.partner.chat_id;

  await bot.copyMessage(partnerChatId as number, fromChatId, messageId, { reply_markup: { keyboard: ma_accept_request_ke } });
}

export default chatForwardMessageReply;
