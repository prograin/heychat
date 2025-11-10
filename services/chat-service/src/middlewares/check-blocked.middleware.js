import axios from "axios";

export const checkBlockedMiddleware = async (req, res, next) => {
  try {
    const requesterId = req.user.user_id;
    const targetId = req.params.userId || req.params.targetId || req.body.partner_id;

    if (!targetId || requesterId == targetId) {
      return res.status(403).json({ message: "Something went wrong. Please try again." });
    }

    const response = await axios.get(`http://${process.env.API_URL}:3007/relations/blocks/check/${targetId}`, {
      headers: { Authorization: req.headers.authorization },
    });

    if (response.data?.isBlocked) {
      return res.status(403).json({ message: "You are blocked by this user." });
    }

    next();
  } catch (error) {
    console.error("Block check error:", error.message);
    return res.status(500).json({ message: "Failed to verify block status." });
  }
};
