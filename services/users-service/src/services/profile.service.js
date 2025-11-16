import {
  createProfile,
  deleteProfileByUserId,
  getProfileByUserId,
  updateProfileByUserId,
  getProfilesByUserIds,
  getProfileByUsername,
} from "../repositories/profile.repository.js";
import validateUtil from "../utils/validate.util.js";
import { responseProfileSchema } from "../schemas/profile.schema.js";
import profileProducer from "../events/producers/profile.producer.js";
import { dropNullFields } from "../utils/objects.util.js";
import usersProfilesCache from "../cache/users-profiles.cache.js";
import profilesCache from "../cache/profiles.cache.js";

/**
 * Creates a new profile if one does not already exist for the user.
 * @param {object} data Profile fields, must include user_id.
 * @param {object} options For passing some option like transaction
 * @returns {Promise<object>} The created profile instance.
 * @throws {Error} 409 if a profile already exists.
 */
export const createProfileService = async (data, options = {}) => {
  const existing = await getProfileByUserId(data.user_id, options);

  if (existing) {
    const error = new Error("Profile already exists");
    error.status = 409;
    throw error;
  }

  const cleaned = dropNullFields(data);

  const profile = await createProfile(cleaned);
  const value = await validateUtil(responseProfileSchema, profile.toJSON(), false, true, false);
  await usersProfilesCache.addUserProfile(value.user_id, value);

  return value;
};

/**
 * retrieve a profile by user_id
 * @param {number} user_id
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getProfileByUserIdService = async (user_id, options = {}) => {
  let profile;

  profile = await usersProfilesCache.getUserProfile(user_id);
  if (profile) return profile;

  if (!profile) profile = await getProfileByUserId(user_id, options);
  if (!profile) return null;

  profile = await validateUtil(responseProfileSchema, profile.toJSON(), false, true, false);

  await usersProfilesCache.addUserProfile(user_id, profile);

  return profile;
};

/**
 * retrieve a profile by user_id
 * @param {list[]} user_ids
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getProfilesByUserIdsService = async (user_ids, options = {}) => {
  if (!user_ids?.length) return [];

  const profilesFromCache = await Promise.all(user_ids.map((id) => usersProfilesCache.getUserProfile(id)));

  const missingIds = user_ids.filter((_, i) => !profilesFromCache[i]);

  let profilesFromDb = [];
  if (missingIds.length > 0) {
    profilesFromDb = await getProfilesByUserIds(missingIds, options);
    profilesFromDb = await Promise.all(
      profilesFromDb.map(async (profile) => {
        const validated = await validateUtil(responseProfileSchema, profile.toJSON(), false, true, false);
        await usersProfilesCache.addUserProfile(validated.user_id, validated);
        return validated;
      })
    );
  }

  const result = user_ids.map((id, i) => profilesFromCache[i] || profilesFromDb.find((p) => p.user_id === id)).filter(Boolean);

  return result;
};

/**
 * retrieve a profile by username
 * @param {string} username
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export const getProfileByUsernameService = async (username, options = {}) => {
  let profile = await profilesCache.getProfileByUsername(username);
  if (!profile) profile = await getProfileByUsername(username, options);
  if (!profile) return null;

  profile = await validateUtil(responseProfileSchema, profile.toJSON(), false, true, false);
  await profilesCache.addProfileByUsername(username, profile);
  return profile;
};

/**
 * @param {number} user_id
 * @param {Object} data
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export const updateProfileByUserIdService = async (user_id, data, options = {}) => {
  const updatedCount = await updateProfileByUserId(user_id, data, options);

  if (updatedCount === 0) {
    const error = new Error(`Profile not found or not updated.`);
    error.status = 404;
    throw error;
  }

  await usersProfilesCache.updateUserProfile(user_id, data);

  const { description, ...publishData } = data || {};
  await profileProducer.publishProfileUpdated(user_id, publishData);

  const profile = await getProfileByUserIdService(user_id, options);
  return profile;
};

/**
 * retrieve a profile by user_id
 * @param {number} user_id
 * @param {Object} options
 * @returns {Promise<Number>}
 */
export const deleteProfileByUserIdService = async (user_id, options = {}) => {
  const profile = await getProfileByUserId(user_id);
  if (profile) {
    return await deleteProfileByUserId(user_id, options);
  } else {
    const error = new Error(`Profile ${user_id} was not found`);
    error.status = 404;
    throw error;
  }
};
