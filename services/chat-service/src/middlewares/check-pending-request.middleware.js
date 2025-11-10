import { getRequestByTargetService } from "../services/requests.service.js";

export const checkPendingRequestMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const targetId = req.params.targetId || req.body.partner_id;

    if (!targetId || userId === targetId) {
      return res.status(400).json({ message: "Something went wrong. Please try again." });
    }

    const request = await getRequestByTargetService(targetId, userId);

    if (!request) {
      return res.status(404).json({ message: "No previous request found." });
    }

    const timeSinceUpdate = Date.now() - new Date(request.updatedAt).getTime();

    if (request.status === "pending") {
      if (timeSinceUpdate > 4 * 60 * 1000) {
        return res.status(403).json({ message: "More than 4 minutes have passed since the last request." });
      }
      return next();
    }

    return res.status(403).json({ message: "You must recieve a request from the user first." });
  } catch (error) {
    console.error("checkPendingRequestMiddleware error:", error);
    return res.status(500).json({ message: "Failed to verify request status." });
  }
};
