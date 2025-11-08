import TelegramBot, { CallbackQuery, Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { ChatSelfController } from "./chat.controller";
import { UserAdminController } from "../users/user.controller";
import { ma_accept_request_ke } from "./chat.markup";

async function chatAcceptRequestReply(bot: TelegramBot, message: Message, response: BotResponse) {
  const callbackDataPart = response.callback!.data.parts;
  const acceptedUserId = Number(callbackDataPart[callbackDataPart.length - 2]);

  const acceptedUserResponse = await UserAdminController.getUserById(acceptedUserId);
  const acceptedUserData = acceptedUserResponse.data;
  const acceptedTelegramChatId = acceptedUserData.telegram_chat_id;

  await ChatSelfController.createSession(response.user.token as string, acceptedUserId);

  await bot.sendMessage(message.chat.id, "You accepted", { reply_markup: { keyboard: ma_accept_request_ke() } });
  await bot.sendMessage(acceptedTelegramChatId, "User accepted", { reply_markup: { keyboard: ma_accept_request_ke() } });
}

export default chatAcceptRequestReply;
