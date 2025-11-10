import BotResponse from "src/bot/types/bot-response.type";
import { Next } from "src/bot/types/next.type";
import { BotEvent } from "src/bot/types/bot-event.type";
import { UserAdminController } from "src/bot/modules/users/user.controller";
import { generateUserToken } from "src/api/utils/auth.util";
import { setUserToken } from "src/api/cache/auth.cache";
import { setMapTelegramToUser, setMapUserToTelegram } from "../modules/users/user.cache";

export const userValidateInterceptor = async (event: BotEvent, response: BotResponse, next: Next) => {
  if (response.user.exists) {
    await next();
    return;
  }

  const userTelegramId = event.from!.id;
  let result;
  try {
    result = await UserAdminController.getUserByTelegramId(BigInt(userTelegramId));

    if (!result.error) {
      const token = await generateUserToken({
        user_id: Number(result.data.id),
        telegram_id: userTelegramId,
        role: "user",
      });

      response.user.exists = true;
      response.user.id = result.data.id;
      response.user.token = token;

      await setMapTelegramToUser(userTelegramId, Number(response.user.id));
      await setMapUserToTelegram(userTelegramId, Number(response.user.id));
      await setUserToken(Number(response.user.id), token);

      console.log(`✅ User exists : ${result.data.id}`);
    } else if (result.error) {
      if (result.status === 404) {
        response.user.exists = false;
        console.log(`ℹ️ User not found : ${userTelegramId}`);
      }
    }
  } catch (error: any) {
    console.error(error);
    return;
  }

  await next();
};
