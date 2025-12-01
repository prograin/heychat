//LINK services/presence-service/doc/examples/cache/cache.js

import { redis } from "../config/redis.js";
import { KEYS } from "../../../../shared/constants/redis.js";

export const setUsersLastActive = async (userId, timestamp) => {
  try {
    redis.zadd(KEYS.users.presence.last_active, timestamp, userId.toString());
    console.log(`Updated last seen for user ${userId} at timestamp ${timestamp}`);
  } catch (error) {
    console.log("Redis ZADD error:", error);
  }
};

export const getUserLastActive = async (userId) => {
  try {
    const score = await redis.zscore(KEYS.users.presence.last_active, userId.toString());

    if (!score) {
      return null; // User not found in cache
    }

    return {
      user_id: userId,
      last_active: new Date(Number(score)),
    };
  } catch (error) {
    console.error("Redis ZSCORE error:", error);
    return null;
  }
};

export const getUsersLastActive = async () => {
  const data = await redis.zrange(KEYS.users.presence.last_active, 0, -1, "WITHSCORES");

  const result = [];
  for (let i = 0; i < data.length; i += 2) {
    result.push({
      user_id: data[i],
      last_active: new Date(Number(data[i + 1])),
    });
  }
  return result;
};

export const deleteUserCache = async (userId) => {
  try {
    await redis.zrem(KEYS.users.presence.last_active, userId.toString());
    console.log(`Deleted user ${userId} from presence tracking`);
  } catch (error) {
    console.error("Redis ZREM error:", error);
  }
};

export const clearInactiveUsers = async () => {
  const now = Date.now();
  const five_min_ago = now - 5 * 60 * 100;

  const removedCount = redis.zremrangebyscore(KEYS.users.presence.last_active, 0, five_min_ago);
  return removedCount;
};
