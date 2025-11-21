import redis from "../../../shared/config/redis";
import { PREFIX_KEY } from "../../../../../../shared/constants/redis.js";

const TTL_30_DAYS = 30 * 24 * 60 * 60; // 2592000 seconds

export const setMapUserToTelegram = async (telegram_id: number, user_id: number) => {
  await redis.set(PREFIX_KEY.map.user.telegram.key(telegram_id), user_id, "EX", TTL_30_DAYS);
};

export const setMapTelegramToUser = async (telegram_id: number, user_id: number) => {
  await redis.set(PREFIX_KEY.map.telegram.user.key(user_id), telegram_id, "EX", TTL_30_DAYS);
};

export const getMapUserToTelegram = async (telegram_id: number) => {
  const key = PREFIX_KEY.map.user.telegram.key(telegram_id);
  const value = await redis.get(key);
  if (value) {
    await redis.expire(key, TTL_30_DAYS); // reset TTL on access
  }
  return value;
};

export const getMapTelegramToUser = async (user_id: number) => {
  const key = PREFIX_KEY.map.telegram.user.key(user_id);
  const value = await redis.get(key);
  if (value) {
    await redis.expire(key, TTL_30_DAYS); // reset TTL on access
  }
  return value;
};

export async function removeMapTelegramToUser(user_id: number) {
  const key = PREFIX_KEY.map.telegram.user.key(user_id);
  await redis.del(key);
}

export async function removeMapUserToTelegram(telegram_id: number) {
  const key = PREFIX_KEY.map.user.telegram.key(telegram_id);
  await redis.del(key);
}
