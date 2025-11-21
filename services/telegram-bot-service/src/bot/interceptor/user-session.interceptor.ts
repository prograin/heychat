import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { BotEvent } from "src/bot/types/bot-event.type";
import { bot } from "src/bot-entry";
import { ChatSelfController } from "../modules/chat/chat.controller";
import { UserAdminController } from "../modules/users/user.controller";
import { getUserTelegramProfileEdit, removeTelegramProfileEdit } from "../modules/profile/profile.cache";
import { getMessageFromEvent } from "../utils/telegram.util";
import { ma_accept_request_ke } from "../modules/chat/chat.markup";

export const userSessionInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  try {
    const token = response.user.token as string;
    if (!token) {
      await next();
      return;
    }

    const checkActiveResponse = await ChatSelfController.checkActiveSession(token);
    const isActive = checkActiveResponse.data.isActive;

    if (isActive) {
      const activeSessionsRes = await ChatSelfController.getActiveSession(token);
      const activeSession = activeSessionsRes.data.sessions[0];
      const partnerUserId = Number(activeSession.partner_id);

      const partnerRes = await UserAdminController.getUserById(partnerUserId);

      if (partnerRes.error) {
        const error = new Error();
        if (partnerRes.status == 404) {
          await ChatSelfController.updateSession(token, partnerUserId, "ended");
          error.message = "Maybe user is deleter or failed to get it";
        }
        throw error;
      }

      response.user.partner.user_id = partnerUserId;
      response.user.partner.telegram_id = Number(partnerRes.data.telegram_id);
      response.user.partner.chat_id = Number(partnerRes.data.telegram_chat_id);

      let telegramProfileEditData = await getUserTelegramProfileEdit(Number(response.user.id));
      if (telegramProfileEditData) {
        const chatId = await getMessageFromEvent(event);
        if (chatId)
          await bot.sendMessage(chatId, "To edit your profile, please end your current chat session and try again.", {
            reply_markup: { keyboard: ma_accept_request_ke },
          });
        await removeTelegramProfileEdit(Number(response.user.id));
      }
    }

    response.user.has_session = isActive;

    await next();
  } catch (error: any) {
    const chatId = "chat" in event ? event.chat.id : event.message?.chat.id;
    await bot.sendMessage(
      Number(chatId),
      error.response?.data?.message || error.message || "Something went wrong while checking your active session."
    );
  }
};
