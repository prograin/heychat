import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { BotEvent } from "src/bot/types/bot-event.type";
import { commandPatterns } from "../buttons/command.button";

export const noneCommandFilterInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  const text = "chat" in event ? event.text : event.message?.text;
  const isMatch = commandPatterns.some((pattern) => pattern.test(text as string));
  if (isMatch) return;
  await next();
};
