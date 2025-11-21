import { RedisStreamConsumer } from "./base.consumer";
import { REDIS_STREAMS, REDIS_EVENTS } from "../../../../../../shared/constants/redis";
import { removeTelegramProfileEdit } from "src/bot/modules/profile/profile.cache";
import { getMapTelegramToUser, removeMapTelegramToUser, removeMapUserToTelegram } from "src/bot/modules/users/user.cache";
import { removeUserToken } from "src/api/cache/auth.cache";

const handleUser = async ({ event, userId, data }: any) => {
  switch (event) {
    case REDIS_EVENTS.user.deleted:
      try {
        const telegramId = await getMapTelegramToUser(userId);
        telegramId && (await removeMapUserToTelegram(Number(telegramId)));
        await removeMapTelegramToUser(userId);
        await removeTelegramProfileEdit(userId);
        await removeUserToken(userId);
      } catch (error: any) {
        if (error.status !== 404) {
          throw error;
        }
      }
      break;

    default:
      console.warn("Unknown event:", event);
  }
};

export const userConsumer = new RedisStreamConsumer({
  stream: REDIS_STREAMS.user.name,
  group: "telegram-bot-service-group",
  consumerName: `telegram-bot-worker-${process.pid}`,
  handleMessage: handleUser,
});
