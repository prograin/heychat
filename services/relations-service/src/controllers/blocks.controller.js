import { createBlockService, deleteBlockByTargetIdService, checkBlockByTargetIdService, getUserBlocksService } from "../services/blocks.service.js";

/**
 * POST /users/:userId/relations/blocks
 * POST /relations/blocks
 */
export async function createBlockController(req, res, next) {
  try {
    const requesterId = req.params.user_id || req.user?.user_id;
    const targetId = req.body.targetId;

    const newBlock = await createBlockService(requesterId, targetId);
    return res.status(201).json({
      message: "Block created successfully",
      data: newBlock,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /users/:userId/relations/blocks
 * GET /relations/blocks
 */
export async function getUserBlocksController(req, res, next) {
  try {
    const userId = req.params.user_id || req.user?.user_id;

    const contacts = await getUserBlocksService(userId);
    return res.status(200).json({
      message: "Blocks fetched successfully",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /users/:userId/relations/blocks/:targetId
 * DELETE /relations/blocks/:targetId
 */
export async function deleteBlockByTargetIdController(req, res, next) {
  try {
    const requesterId = req.params.user_id || req.user?.user_id;
    const targetId = req.params.targetId;

    await deleteBlockByTargetIdService(requesterId, targetId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * GET /users/:userId/relations/blocks/:targetId/check
 * GET /relations/blocks/:targetId/check
 */
export async function checkBlockByTargetIdController(req, res, next) {
  try {
    const requesterId = req.params.userId || req.user?.user_id; // <---Problem here userId undefined
    const targetId = req.params.targetId;

    const isBlocked = await checkBlockByTargetIdService(requesterId, targetId);

    return res.status(200).json({
      isBlocked: isBlocked,
      message: isBlocked ? "User is blocked" : "User is not blocked",
    });
  } catch (error) {
    next(error);
  }
}
