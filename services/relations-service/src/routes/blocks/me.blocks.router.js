import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowRole } from "../../middlewares/allow-role.middleware.js";
import {
  createBlockController,
  checkBlockByTargetIdController,
  deleteBlockByTargetIdController,
  getUserBlocksController,
} from "../../controllers/blocks.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, allowRole("user", "admin"), createBlockController);
router.get("/", authMiddleware, allowRole("user", "admin"), getUserBlocksController);
router.get("/check/:targetId", authMiddleware, allowRole("user", "admin"), checkBlockByTargetIdController);
router.delete("/:targetId", authMiddleware, allowRole("user", "admin"), deleteBlockByTargetIdController);

export default router;
