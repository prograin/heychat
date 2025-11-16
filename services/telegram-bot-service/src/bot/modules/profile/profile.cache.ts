import redis from "src/shared/config/redis";
import { PREFIX_KEY } from "../../../../../../shared/constants/redis";

const EDIT_PROFILE_TTL = 2 * 60;

export async function setUserTelegramProfileEdit(userId: number, data: object) {
  const key = PREFIX_KEY.user.telegram.profile.edit.key(userId);
  await redis.set(key, JSON.stringify(data));
  await redis.expire(key, EDIT_PROFILE_TTL);
}

export async function getUserTelegramProfileEdit(userId: number) {
  const key = PREFIX_KEY.user.telegram.profile.edit.key(userId);
  const cached = await redis.get(key);
  if (!cached) return null;

  const cachedParsed = JSON.parse(cached);
  if (!cached || Object.keys(cachedParsed).length === 0) return null;

  await redis.expire(key, EDIT_PROFILE_TTL);
  return cachedParsed;
}

export async function removeTelegramProfileEdit(userId: number) {
  const key = PREFIX_KEY.user.telegram.profile.edit.key(userId);
  await redis.del(key);
}
