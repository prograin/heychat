import redis from "../../config/redis.js";
import { REDIS_STREAMS, REDIS_EVENTS } from "../../../../../shared/constants/redis.js";

class SessionProducer {
  async publishSessionCreated(userId, data) {
    try {
      const messageId = redis.xadd(
        REDIS_STREAMS.chat.session.name,
        "*",
        "event",
        REDIS_EVENTS.chat.session.created,
        "userId",
        String(userId),
        "data",
        JSON.stringify(data)
      );
      return messageId;
    } catch (error) {
      console.error("❌ Failed to publish session created:", error);
      throw error;
    }
  }

  async publishSessionUpdated(userId, data) {
    try {
      const messageId = redis.xadd(
        REDIS_STREAMS.chat.session.name,
        "*",
        "event",
        REDIS_EVENTS.chat.session.updated,
        "userId",
        String(userId),
        "data",
        JSON.stringify(data)
      );
      return messageId;
    } catch (error) {
      console.error("❌ Failed to publish session updated:", error);
      throw error;
    }
  }
}

export default new SessionProducer();
