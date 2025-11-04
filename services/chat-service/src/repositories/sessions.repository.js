//LINK doc\samples\sessions-sequalize.json

import SessionModel from "../models/sessions.model.js";

export const createSession = async (userId, partnerId, status = "active") => {
  return await SessionModel.create({ user_id: userId, partner_id: partnerId, status });
};

export const getSessionsByFilter = async (filters = {}) => {
  const where = {};
  if (filters.userId !== undefined) where.user_id = filters.userId;
  if (filters.partnerId !== undefined) where.partner_id = filters.partnerId;
  if (filters.status !== undefined) where.status = filters.status;

  return await SessionModel.findAll({ where });
};

export const getSessionsByUserId = async (userId) => {
  return await SessionModel.findAll({
    where: {
      user_id: userId,
    },
  });
};

export const getSessionsByTargetId = async (userId, partnerId) => {
  return await SessionModel.findAll({
    where: {
      user_id: userId,
      partner_id: partnerId,
    },
  });
};

export const getActiveSessions = async (userId) => {
  return await SessionModel.findAll({
    where: {
      user_id: userId,
      status: "active",
    },
  });
};

export const updateSessionStatus = async (userId, partnerId, status) => {
  const [updatedCount, [updatedSession]] = await SessionModel.update(
    { status },
    {
      where: {
        user_id: userId,
        partner_id: partnerId,
      },
      returning: true,
    }
  );
  return updatedSession;
};
