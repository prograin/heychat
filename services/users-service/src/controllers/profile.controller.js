import {
  createProfileService,
  deleteProfileByUserIdService,
  getProfileByUserIdService,
  updateProfileByUserIdService,
  getProfilesByUserIdsService,
  getProfileByUsernameService,
} from "../services/profile.service.js";

export const createProfileByUserIdController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const body = req.validatedBody;
    body.id = userId;

    const profile = await createProfileService(body);

    res.status(201).json({ profile: profile });
  } catch (error) {
    next(error);
  }
};

export const getMyProfileController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const profile = await getProfileByUserIdService(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile: profile });
  } catch (error) {
    next(error);
  }
};

export const getProfileByUserIdController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const profile = await getProfileByUserIdService(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile: profile });
  } catch (error) {
    next(error);
  }
};

export const getProfilesByUserIdsController = async (req, res, next) => {
  try {
    const userIdsQuery = req.query.userIds;

    if (!userIdsQuery || typeof userIdsQuery !== "string") {
      return res.status(400).json({ message: "userIds query parameter is required" });
    }

    const idsArray = userIdsQuery
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => !isNaN(id));

    if (idsArray.length === 0) {
      return res.status(400).json({ message: "No valid userIds provided" });
    }

    const profiles = await getProfilesByUserIdsService(idsArray);

    return res.status(200).json({
      message: "Profiles fetched successfully",
      data: profiles,
    });
  } catch (err) {
    console.error("Error in getProfilesByUserIdsController:", err);
    next(err);
  }
};

export const getProfileByUsernameController = async (req, res, next) => {
  try {
    const username = req.params.username;
    const profile = await getProfileByUsernameService(username);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileController = async (req, res, next) => {
  try {
    const body = req.validatedBody;
    const userId = req.user.user_id;
    const profile = await updateProfileByUserIdService(userId, body);
    await res.status(200).json({ status: "success", profile });
  } catch (error) {
    next(error);
  }
};

export const deleteProfileByUserIdController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: "User id has not been defined" });
    }

    await deleteProfileByUserIdService(userId);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};
