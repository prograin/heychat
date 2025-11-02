import redis from "../../config/redis.js";
import { pathToFileURL } from "url";

import { REDIS_STREAMS, REDIS_EVENTS } from "../../../../../shared/constants/redis.js";

class UserProducer {
  async publishUserAdded(userId, data) {
    try {
      const messageId = redis.xadd(
        REDIS_STREAMS.user.name,
        "*",
        "event",
        REDIS_EVENTS.user.added,
        "userId",
        String(userId),
        "data",
        JSON.stringify(data)
      );
      return messageId;
    } catch (error) {
      console.error("❌ Failed to publish user added:", error);
      throw error;
    }
  }

  async publishUserDeleted(userId, data) {
    try {
      const messageId = redis.xadd(
        REDIS_STREAMS.user.name,
        "*",
        "event",
        REDIS_EVENTS.user.deleted,
        "userId",
        String(userId),
        "data",
        JSON.stringify(data)
      );
      return messageId;
    } catch (error) {
      console.error("❌ Failed to publish user deleted:", error);
      throw error;
    }
  }
}

export default new UserProducer();

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  (async () => {
    try {
      const userProducer = new UserProducer();
      const messageId = await userProducer.publishUserDeleted(58, {});
      console.log("Published deleted message with ID:", messageId);
    } catch (err) {
      console.error(err);
    } finally {
      await redis.quit();
    }
  })();
}
