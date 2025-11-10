import { CallbackQuery } from "node-telegram-bot-api";
import { BotEvent } from "../types/bot-event.type";
import BotResponse from "../types/bot-response.type";
import { Next } from "../types/next.type";
import { bot } from "src/bot-entry";
import { ButtonsData } from "../buttons/constants.button";

export const inlineButtonValidateInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  const rawData = response.callback?.data.raw || "";
  const matchedButton = ButtonsData.find((btn) => btn.pattern.test(rawData));
  const shouldExpire = matchedButton?.should_expire ?? false;

  if (!shouldExpire) {
    next();
  } else {
    const now = Math.floor(Date.now() / 1000);
    const callbackQuery = event as CallbackQuery;
    const messageTime = callbackQuery.message!.date;
    const secondsPassed = now - messageTime;
    if (secondsPassed > 300) {
      try {
        bot.answerCallbackQuery(callbackQuery.id, {
          show_alert: true,
          text: "⚠️ This button has expired. Please start a new to continue.",
        });

        await bot.deleteMessage(callbackQuery.message!.chat.id, callbackQuery.message!.message_id);
      } catch (err: any) {}
      return;
    }
    await next();
  }
  return;
};
