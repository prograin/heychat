import { getUserToken } from "src/api/cache/auth.cache";
import { BotEvent } from "src/bot/types/bot-event.type";
import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { bot } from "src/bot-entry";
import { getMessageFromEvent } from "src/bot/utils/telegram.util";
import { TelegramProfileEditData } from "../types/bot-telegram-profile-edit";
import { getUserTelegramProfileEdit, removeTelegramProfileEdit } from "../modules/profile/profile.cache";

export const profileEditInterceptor = (disable: boolean) => {
  return async (event: BotEvent, response: BotResponse, next: Next) => {
    try {
      if (disable) {
        response.edit_profile.isActive = false;
        if (response.user.id) {
          await removeTelegramProfileEdit(Number(response.user.id));
        }

        next();
      } else {
        let telegramProfileEditData = (await getUserTelegramProfileEdit(Number(response.user.id))) as TelegramProfileEditData;
        if (telegramProfileEditData && telegramProfileEditData.isActive) {
          response.edit_profile.isActive = true;
        } else {
          response.edit_profile.isActive = false;
        }
        next();
      }
    } catch (err: any) {
      const chat_id = await getMessageFromEvent(event);
      if (chat_id) {
        await bot.sendMessage(chat_id, "Failed.");
      }
    }
  };
};
