import express from "express";
import { createSessionSchema, updateSessionSchema } from "../schemas/sessions.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRole } from "../middlewares/allow-role.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  checkActiveSessionController,
  createSessionController,
  getSessionsByTargetController,
  getSessionsController,
  updateSessionController,
} from "../controllers/sessions.controller.js";
import { checkBlockedMiddleware } from "../middlewares/check-blocked.middleware.js";

export const topLevelSessionsRouter = express.Router();
export const usersSessionsRouter = express.Router({ mergeParams: true });

topLevelSessionsRouter.post(
  "/me",
  authMiddleware,
  allowRole("admin", "user"),
  checkBlockedMiddleware,
  validateMiddleware(createSessionSchema),
  createSessionController
);
topLevelSessionsRouter.get("/target/:targetId", authMiddleware, allowRole("admin", "user"), getSessionsByTargetController);
topLevelSessionsRouter.get("/me", authMiddleware, allowRole("admin", "user"), getSessionsController);
topLevelSessionsRouter.get("/check/active/me", authMiddleware, allowRole("admin", "user"), checkActiveSessionController);
topLevelSessionsRouter.put("/me", authMiddleware, allowRole("admin", "user"), validateMiddleware(updateSessionSchema), updateSessionController);

usersSessionsRouter.get("/", authMiddleware, allowRole("admin"), getSessionsController);
usersSessionsRouter.get("/check/active", authMiddleware, allowRole("admin", "user"), checkBlockedMiddleware, checkActiveSessionController);
