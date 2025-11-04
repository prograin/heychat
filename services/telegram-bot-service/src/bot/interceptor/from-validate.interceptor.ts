import { Message } from "node-telegram-bot-api";
import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { BotEvent } from "src/bot/types/bot-event.type";

export const fromValidateInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  if (!event.from) return;
  await next();
};
