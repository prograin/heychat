import { createOrUpdateService, getRequestByTargetService, getRequestsBySenderIdService } from "../services/requests.service.js";
import requestsCache from "../cache/requests.cache.js";

export const createOrUpdateController = async (req, res, next) => {
  try {
    const sender_user_id = req.params.user_id || req.user?.user_id;
    const { reciever_user_id, status } = req.body;

    if (!sender_user_id || !reciever_user_id) {
      return res.status(400).json({
        success: false,
        message: "reciever_user_id are required.",
      });
    }

    await createOrUpdateService(sender_user_id, reciever_user_id, status);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const getRequestsController = async (req, res, next) => {
  try {
    const userId = req.params.user_id || req.user?.user_id;
    if (!userId) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const requests = await getRequestsBySenderIdService(userId);
    res.status(200).json({ data: requests });
  } catch (error) {
    next(error);
  }
};

export const getRequestByTargetController = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { targetId } = req.params;

    const request = await getRequestByTargetService(userId, targetId);

    if (!request) {
      return res.status(404).json({ error: true, message: "Request not found" });
    }

    return res.status(200).json({ request });
  } catch (error) {
    next(error);
  }
};
