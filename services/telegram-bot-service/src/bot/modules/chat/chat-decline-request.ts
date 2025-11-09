import TelegramBot, { Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { UserAdminController } from "../users/user.controller";
import { ma_main_ke } from "../start/start.markup";
import { decline_request_reciever, decline_request_requester } from "./chat.text";
import { ChatSelfController } from "./chat.controller";

async function chatDeclineRequestReply(bot: TelegramBot, message: Message, response: BotResponse) {
  const callbackDataPart = response.callback!.data.parts;
  const userUsername = response.user.profile!.username as string;

  const acceptedUserId = Number(callbackDataPart[callbackDataPart.length - 2]);
  const acceptedUserResponse = await UserAdminController.getUserById(acceptedUserId);
  const acceptedUserData = acceptedUserResponse.data;
  const acceptedTelegramChatId = acceptedUserData.telegram_chat_id;

  await ChatSelfController.updateRequest(response.user.token as string, acceptedUserId, Number(response.user.id), "rejected");

  await bot.sendMessage(message.chat.id, decline_request_reciever, { reply_markup: { keyboard: ma_main_ke.keyboard } });
  await bot.sendMessage(acceptedTelegramChatId, decline_request_requester(userUsername), {
    reply_markup: { keyboard: ma_main_ke.keyboard },
  });

  try {
    await bot.deleteMessage(message.chat.id, message.message_id);
  } catch {}
}

export default chatDeclineRequestReply;
