import TelegramBot, { Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { getUserTelegramProfileEdit, removeTelegramProfileEdit, setUserTelegramProfileEdit } from "./profile.cache";
import { TelegramProfileEditData } from "src/bot/types/bot-telegram-profile-edit";
import { cancel_edit_profile_not_exists_text, cancel_edit_profile_text } from "./profile.text";
import { safeRunFunction } from "src/shared/utils/safe-run.util";

async function cancelEditProfile(bot: TelegramBot, message: Message, response: BotResponse, editMessage: boolean = false, safeEdit: boolean = false) {
  const userId = response.user.id;
  const messageId = message.message_id;
  const chatId = message.chat.id;

  let telegramProfileEditData = (await getUserTelegramProfileEdit(Number(response.user.id))) as TelegramProfileEditData;
  if (telegramProfileEditData && telegramProfileEditData.isActive) {
    await removeTelegramProfileEdit(Number(userId));
    if (editMessage) {
      if (safeEdit) {
        safeRunFunction(() => bot.editMessageText(cancel_edit_profile_text, { chat_id: chatId, message_id: messageId }));
      } else {
        await bot.editMessageText(cancel_edit_profile_text, { chat_id: chatId, message_id: messageId });
      }
    } else {
      await bot.sendMessage(chatId as number, cancel_edit_profile_text);
    }
  } else {
    await bot.sendMessage(chatId as number, cancel_edit_profile_not_exists_text);
  }
}

export default cancelEditProfile;
