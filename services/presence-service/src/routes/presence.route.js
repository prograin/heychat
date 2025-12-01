import express from "express";
import { createPresencesSchema } from "../schemas/presence.schema.js";
import { postPresenceController, deletePresenceByUserIdController, getPresenceController } from "../controllers/presence.controller.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRole } from "../middlewares/allow-role.middleware.js";
import { checkBlockedMiddleware } from "../middlewares/check-blocked.middleware.js";

export const topLevelPresenceRouter = express.Router();
export const usersPresenceRouter = express.Router({ mergeParams: true });

usersPresenceRouter.post("/", authMiddleware, allowRole("admin"), validate(createPresencesSchema), postPresenceController);
usersPresenceRouter.get("/", authMiddleware, allowRole("admin", "user"), checkBlockedMiddleware, getPresenceController);
usersPresenceRouter.delete("/", authMiddleware, allowRole("admin"), deletePresenceByUserIdController);

topLevelPresenceRouter.get("/me", authMiddleware, allowRole("admin", "user"), getPresenceController);
