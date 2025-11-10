import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import { UserAdminController } from "../users/user.controller";
import { ChatSelfController } from "./chat.controller";
import User from "src/bot/types/user.type";
import { recieved_request, requests_was_sent_text, send_request_text, user_has_active_session } from "./chat.text";
import { ma_send_request_in } from "./chat.markup";
import BotResponse from "src/bot/types/bot-response.type";

const THRESHOLD = 4 * 60 * 1000;

async function chatSendRequestReply(bot: TelegramBot, callbackQuery: CallbackQuery, response: BotResponse, to_user_id: number) {
  if (response.user.has_session) {
    await bot.sendMessage(callbackQuery.message!.chat.id, user_has_active_session);
    return;
  }

  const to_user_response = await UserAdminController.getUserById(to_user_id);
  const from_user = response.user;
  const to_user = to_user_response.data;
  const to_telegram_chat_id = to_user.telegram_chat_id;

  const from_user_id = from_user.id;
  const from_token = from_user.token;
  const from_username = from_user.profile?.username;
  const from_telegram_chat_id = callbackQuery.message!.chat.id;

  const data = await ChatSelfController.getRequestByTarget(from_token || "", to_user_id);
  let request;
  if (!data.error) {
    request = data.request;
    const updated_at = new Date(request.updatedAt).getTime();
    const now = Date.now();

    const elapsed = now - updated_at;

    if (elapsed < THRESHOLD) {
      try {
        await bot.answerCallbackQuery(callbackQuery.id, { text: requests_was_sent_text(elapsed, THRESHOLD - elapsed), show_alert: true });
      } catch {}
    } else {
      await bot.sendMessage(to_telegram_chat_id, recieved_request(from_username), {
        reply_markup: { inline_keyboard: ma_send_request_in(String(from_user_id)) },
      });
      await bot.sendMessage(from_telegram_chat_id, send_request_text);
      await ChatSelfController.createRequest(from_token || "", Number(from_user_id), to_user_id);
    }
  } else {
    if (data.status === 404) {
      await bot.sendMessage(to_telegram_chat_id, recieved_request(from_username), {
        reply_markup: { inline_keyboard: ma_send_request_in(String(from_user_id)) },
      });
      await bot.sendMessage(from_telegram_chat_id, send_request_text);
      await ChatSelfController.createRequest(from_token || "", Number(from_user_id), to_user_id);
    }
  }
}

export default chatSendRequestReply;
