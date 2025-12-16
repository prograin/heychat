import { getUserLastActive } from "../cache/users.cache.js";
import {
  createPresenceRepository,
  getPresenceByUserIdRepository,
  bulkUpdatePresenceRepository,
  deletePresenceByUserIdRepository,
} from "../repositories/presence.repository.js";
import { responsePresencesSchema } from "../schemas/presence.schema.js";
import { validateSchemaUtil } from "../utils/validate.util.js";

/**
 * Create a new presence record for a user.
 * Throws 409 if a presence already exists.
 * @param {Object} data - Presence data.
 * @returns {Promise<Object>} The validated presence object.
 * @throws {Error} 409 if presence already exists, or other errors from repository/validation.
 */
export const createPresenceService = async (data) => {
  const existing = await getPresenceByUserIdRepository(data.user_id);
  if (existing) {
    const error = new Error("Presence already exists for this user");
    error.status = 409;
    throw error;
  }

  const presence = await createPresenceRepository(data);
  const value = await validateSchemaUtil(responsePresencesSchema, presence.toJSON(), false, true);
  return value;
};

/**
 * Bulk update multiple presence records.
 * @param {Array<Object>} data - Array of presence objects to update.
 * @returns {Promise<void>} Resolves when all updates are completed.
 */
export const bulkUpdatePresenceService = async (data) => {
  await bulkUpdatePresenceRepository(data);
};

/**
 * Get a presence record by user ID.
 * @param {Object} data - Object containing user_id.
 * @param {number} data.user_id - ID of the user.
 * @returns {Promise<Object|null>} The validated presence object if found, otherwise null.
 */
export const getPresenceService = async (user_id) => {
  let presence = await getUserLastActive(user_id);
  if (presence) return presence;

  presence = await getPresenceByUserIdRepository(user_id);
  if (!presence) return null;

  const value = await validateSchemaUtil(responsePresencesSchema, presence.toJSON(), false, true);
  return value;
};

/**
 * Delete a presence record by user ID.
 * @param {number} user_id - ID of the user whose presence should be deleted.
 * @returns {Promise<number>} The number of deleted rows.
 */
export const deletePresenceByUserIdService = async (user_id) => {
  const existing = getPresenceByUserIdRepository(user_id);
  if (existing) {
    return await deletePresenceByUserIdRepository(user_id);
  } else {
    const error = new Error("Presence does not exist for this user");
    error.status = 404;
    throw error;
  }
};
