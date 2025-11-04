import axios from "axios";

export const checkBlockedMiddleware = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const targetId = req.params.userId;

    if (!targetId || requesterId === targetId) {
      return next();
    }

    const response = await axios.get(`http://${process.env.API_URL}:3007/relations/blocks/check/${targetId}`, {
      headers: { Authorization: req.headers.authorization },
    });

    if (response.data?.isBlocked) {
      return res.status(403).json({ error: "You are blocked by this user." });
    }

    next();
  } catch (error) {
    console.error("Block check error:", error.message);
    return res.status(500).json({ error: "Failed to verify block status." });
  }
};
