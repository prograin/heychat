import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { ChatSelfController } from "./chat.controller";
import { UserAdminController } from "../users/user.controller";
import { ma_accept_request_ke } from "./chat.markup";
import { accept_request_reciever, accept_request_requester, user_has_active_session } from "./chat.text";
import { ma_main_ke } from "../start/start.markup";

async function chatAcceptRequestReply(bot: TelegramBot, message: Message, response: BotResponse) {
  if (response.user.has_session) {
    await bot.sendMessage(message.chat.id, user_has_active_session);
    return;
  }

  const callbackDataPart = response.callback!.data.parts;
  const acceptedUserId = Number(callbackDataPart[callbackDataPart.length - 2]);

  const acceptedUserResponse = await UserAdminController.getUserById(acceptedUserId);
  const acceptedUserData = acceptedUserResponse.data;
  const acceptedTelegramChatId = acceptedUserData.telegram_chat_id;

  const acceptedActiveSessionResponse = await ChatSelfController.checkUserActiveSession(response.user.token as string, acceptedUserId);

  if (acceptedActiveSessionResponse.data.isActive) {
    await bot.sendMessage(message.chat.id, "This user is currently in a chat with someone else.", {
      reply_markup: { keyboard: ma_main_ke.keyboard },
    });
    return;
  }

  await ChatSelfController.createSession(response.user.token as string, acceptedUserId);
  await ChatSelfController.updateRequest(response.user.token as string, acceptedUserId, Number(response.user.id), "accepted");

  await bot.sendMessage(message.chat.id, accept_request_reciever, { reply_markup: { keyboard: ma_accept_request_ke } });
  await bot.sendMessage(acceptedTelegramChatId, accept_request_requester, { reply_markup: { keyboard: ma_accept_request_ke } });

  try {
    await bot.deleteMessage(message.chat.id, message.message_id);
  } catch {}
}

export default chatAcceptRequestReply;
