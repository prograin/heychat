import redis from "../config/redis.js";
import { PREFIX_KEY } from "../../../../shared/constants/redis.js";

class SessionsCache {
  SESSIONTTL = 600;

  async setHasActiveSession(userId, hasActive) {
    const key = PREFIX_KEY.chats.sessions.has_active.key(userId);
    await redis.set(key, String(hasActive));
    await redis.expire(key, this.SESSIONTTL);
  }

  async getHasActiveSession(userId) {
    const key = PREFIX_KEY.chats.sessions.has_active.key(userId);
    let cached = await redis.get(key);

    if (cached === null) return null;
    return cached === "true";
  }
}
export default new SessionsCache();
