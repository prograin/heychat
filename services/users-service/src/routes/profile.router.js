import express from "express";
import {
  getMyProfileController,
  updateMyProfileController,
  createProfileByUserIdController,
  getProfileByUserIdController,
  getProfilesByUserIdsController,
  deleteProfileByUserIdController,
  getProfileByUsernameController,
} from "../controllers/profile.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { updateProfileSchema, createProfileSchema } from "../schemas/profile.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRole } from "../middlewares/allow-role.middleware.js";
import { checkBlockedMiddleware } from "../middlewares/check-blocked.middleware.js";

export const userProfileRouter = express.Router({ mergeParams: true });
export const topProfilesRouter = express.Router();

// profile router doesn't use user_id and it does't blong to a specific user
// userProfileRouterbelongs to specific user

// --------------------------

// UPDATE    /profiles/me
// GET    /profiles/me
// GET   /profiles

topProfilesRouter.put("/me", authMiddleware, allowRole("admin", "user"), validateMiddleware(updateProfileSchema), updateMyProfileController);
topProfilesRouter.get("/me", authMiddleware, allowRole("admin", "user"), getMyProfileController);
topProfilesRouter.get("/", authMiddleware, allowRole("admin", "user"), getProfilesByUserIdsController);
topProfilesRouter.get("/username/:username", authMiddleware, allowRole("admin"), getProfileByUsernameController);

// --------------------------

// POST   /users/:userId/profile
// GET   /users/:userId/profile
// DEL   /users/:userId/profile

userProfileRouter.post("/", authMiddleware, allowRole("admin"), validateMiddleware(createProfileSchema), createProfileByUserIdController);
userProfileRouter.get("/", authMiddleware, allowRole("admin", "user"), checkBlockedMiddleware, getProfileByUserIdController);
userProfileRouter.delete("/", authMiddleware, allowRole("admin"), deleteProfileByUserIdController);

// --------------------------
