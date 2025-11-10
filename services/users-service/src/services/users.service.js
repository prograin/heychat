import UsersCache from "../cache/users.cache.js";
import { createUser, deleteUser, getUser, getUserByTelegramId } from "../repositories/users.repository.js";
import { usersResponseSchema } from "../schemas/users.schema.js";
import validateUtil from "../utils/validate.util.js";
import { createProfileService } from "./profile.service.js";
import { dropNullFields } from "../utils/objects.util.js";
import userProducer from "../events/producers/user.producer.js";

// ------------------------------------------------------
// SET
// ------------------------------------------------------

/**
 * Create New User When User Start Telegram -->>  If Exists ,it will be returned
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const createUserService = async (data, force) => {
  const existingUser = await getUserByTelegramIdService(data.telegram_id);

  if (existingUser) {
    if (force) {
      profile = await createProfileService({ user_id: Number(existingUser.id), username: existingUser.id });
      await userProducer.publishUserAdded(existingUser.id, { user_id: existingUser.id, username: existingUser.id });
      const value = await validateUtil(usersResponseSchema, existingUser.toJSON(), false, true);
      await UsersCache.addUser(existingUser.id, value);

      return value;
    } else {
      const value = await validateUtil(usersResponseSchema, existingUser.toJSON(), false, true);
      await UsersCache.addUser(existingUser.id, value);
      const error = new Error("User already exists");
      error.status = 409;
      throw error;
    }
  }

  const cleaned = dropNullFields(data);

  let user, presence, profile, search;

  try {
    user = await createUser(cleaned);
    profile = await createProfileService({ user_id: Number(user.id), username: user.id });

    await userProducer.publishUserAdded(user.id, { user_id: user.id, username: user.id });
  } catch (err) {
    if (user) await deleteUser(user.id);
    await userProducer.publishUserDeleted(user.id, { user_id: user.id });
    throw err;
  }

  const value = await validateUtil(usersResponseSchema, user.toJSON(), false, true);
  await UsersCache.addUser(user.id, value);

  return value;
};

// ------------------------------------------------------
// GET
// ------------------------------------------------------

/**
 * Get user by its id
 * @param {number} id
 * @returns
 */
export const getUserService = async (id) => {
  let user;
  user = await UsersCache.getUser(id);
  if (user) return user;

  user = await getUser(id);
  if (user) {
    const value = await validateUtil(usersResponseSchema, user.toJSON(), false, true);
    await UsersCache.addUser(id, value);
    return value;
  } else {
    await UsersCache.deleteUser(id);
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};

/**
 * Get user by telegram id
 * @param {Number} id
 * @returns
 */
export const getUserByTelegramIdService = async (id) => {
  const user = await getUserByTelegramId(id);
  if (user) {
    const value = await validateUtil(usersResponseSchema, user.toJSON(), false, true);
    await UsersCache.addUser(user.id, value);
    return value;
  } else {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};

/**
 * Delete user by id
 * @param {Number} id
 * @returns
 */
export const deleteUserService = async (id, from = "server") => {
  if (from === "server") {
    await userProducer.publishUserDeleted(id, { userId: id });
  }

  const user = await getUser(id);
  if (user) {
    return await deleteUser(id);
  } else {
    const error = new Error(`User ${id} was not found`);
    error.status = 404;
    throw error;
  }
};
