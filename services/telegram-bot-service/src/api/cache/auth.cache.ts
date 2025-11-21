import redis from "../../shared/config/redis";
import { PREFIX_KEY } from "../../../../../shared/constants/redis";

const TTL_30_DAYS = 30 * 24 * 60 * 60; // 2592000 seconds

export const setUserToken = async (user_id: number, token: string) => {
  await redis.set(PREFIX_KEY.user.token.key(user_id), token, "EX", TTL_30_DAYS);
};

export const getUserToken = async (user_id: number | null) => {
  return await redis.get(PREFIX_KEY.user.token.key(user_id));
};

export const removeUserToken = async (user_id: number | null) => {
  return await redis.del(PREFIX_KEY.user.token.key(user_id));
};
