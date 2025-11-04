import { getUserToken } from "src/api/cache/auth.cache";
import { BotEvent } from "src/bot/types/bot-event.type";
import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { bot } from "src/bot-entry";
import { getMessageFromEvent } from "src/bot/utils/telegram.util";
import { verifyUserToken } from "src/api/utils/auth.util";
import { getMapUserToTelegram } from "../modules/users/user.cache";
import { commandPatterns } from "../buttons/command.button";

export const authInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  try {
    const telegram_id = Number(event.from?.id);
    const user_id = await getMapUserToTelegram(telegram_id);
    const token = await getUserToken(Number(user_id));

    if (token) {
      const decoded = await verifyUserToken(token);

      response.user.id = decoded.user_id;
      response.user.telegram_id = decoded.telegram_id;
      response.user.token = token;
      response.user.exists = true;

      return next();
    } else {
      const chatId = "chat" in event ? event.chat.id : event.message?.chat.id;
      await bot.sendMessage(chatId as number, "Please /start and try again");
    }
  } catch (err: any) {
    const chat_id = await getMessageFromEvent(event);
    if (chat_id) {
      await bot.sendMessage(chat_id, "❌ You are not authenticated. Please log in first.");
    } else {
      console.error("Failed to extract chat ID from event for unauthenticated user");
    }
  }

  return;
};
