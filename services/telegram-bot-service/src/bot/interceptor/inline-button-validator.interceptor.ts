import { CallbackQuery } from "node-telegram-bot-api";
import { BotEvent } from "../types/bot-event.type";
import BotResponse from "../types/bot-response.type";
import { Next } from "../types/next.type";
import { bot } from "src/bot-entry";
import { ButtonsData } from "../buttons/constants.button";

export const inlineButtonValidateInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  const rawData = response.callback?.data.raw || "";
  const buttonData = ButtonsData[rawData] || {};
  const shouldExpire = buttonData.should_expire ?? false;

  if (!shouldExpire) {
    next();
  } else {
    const now = Math.floor(Date.now() / 1000);
    const callbackQuery = event as CallbackQuery;
    const messageTime = callbackQuery.message!.date;
    const secondsPassed = now - messageTime;
    if (secondsPassed > 300) {
      bot.answerCallbackQuery(callbackQuery.id, {
        show_alert: true,
        text: "⚠️ This button has expired. Please start a new to continue.",
      });
      try {
        await bot.deleteMessage(callbackQuery.message!.chat.id, callbackQuery.message!.message_id);
      } catch (err: any) {}
      return;
    }
    await next();
  }
  return;
};
