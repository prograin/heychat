import { ErrorUtil } from "../utils/error.util.js";
import {
  createSession,
  getSessionsByFilter,
  getSessionsByUserId,
  getSessionsByTargetId,
  updateSessionStatus,
  getActiveSessions,
} from "../repositories/sessions.repository.js";
import sessionsCache from "../cache/sessions.cache.js";

export const createSessionService = async (userId, partnerId) => {
  const existing = await getSessionsByFilter({ userId, partnerId, status: "active" });
  if (existing.length !== 0) throw new ErrorUtil("Session already exists", 409);

  const session = await createSession(userId, partnerId, "active");
  await sessionsCache.setHasActiveSession(userId, hasActive);
  return session;
};

export const getActiveSessionService = async (userId) => {
  return await getSessionsByFilter({ userId, status: "active" });
};

export const getSessionsService = async (userId) => {
  return await getSessionsByUserId(userId);
};

export const getSessionsByTargetService = async (userId, partnerId) => {
  return await getSessionsByTargetId(userId, partnerId);
};

export const updateSessionService = async (userId, partnerId, status) => {
  const updated = await updateSessionStatus(userId, partnerId, status);
  if (!updated) throw new ErrorUtil("Session not found", 404);
  await sessionsCache.setHasActiveSession(userId, status === "active");
  return updated;
};

export const checkActiveSessionService = async (userId) => {
  const hasActiveSession = await sessionsCache.getHasActiveSession(userId);
  if (hasActiveSession != null) return hasActiveSession;
  const sessions = await getActiveSessions(userId);
  const hasActive = sessions.length > 0;

  await sessionsCache.setHasActiveSession(userId, hasActive);
  return hasActive;
};
