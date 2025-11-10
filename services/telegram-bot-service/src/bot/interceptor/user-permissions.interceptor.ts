import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { BotEvent } from "src/bot/types/bot-event.type";
import { filedsForSearch } from "../modules/search/search.constants";
import { ProfileSelfController } from "../modules/profile/profile.controller";
import { bot } from "src/bot-entry";
import { CallbackQuery } from "node-telegram-bot-api";

export const userPermissionsInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  const callbackQuery = event as CallbackQuery;
  const cahtId = callbackQuery.message?.chat.id as number;
  const token = response.user.token;
  const profileResponse = await ProfileSelfController.getProfile(token as string);

  if (profileResponse.error) {
    try {
      await bot.answerCallbackQuery(callbackQuery.id, { text: "Profile Not Found .", show_alert: true });
    } catch {}
    await bot.sendMessage(cahtId, "/start");
    return;
  }

  const profile = profileResponse.data.profile;
  response.user.profile = profile;

  for (const key of Object.keys(profile)) {
    if (filedsForSearch.includes(key)) {
      response.user.permissions.search?.push(key);
    }
  }

  await next();
};
