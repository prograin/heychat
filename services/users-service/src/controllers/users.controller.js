import { getUserByTelegramIdService, createUserService, getUserService, deleteUserService } from "../services/users.service.js";

//Create New User When User Start Telegram -->> If exists, it will be returned
export const postUserController = async (req, res, next) => {
  try {
    const data = req.validatedBody;
    const force = req.query.force || false;
    const user = await createUserService(data, Boolean(force));

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getMyUserController = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await getUserService(userId);

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Get user
export const getUserController = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await getUserService(id);
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Get user by external id
export const getUserByTelegramIdController = async (req, res, next) => {
  try {
    const { id: telegram_id } = req.params;
    const data = await getUserByTelegramIdService(telegram_id);
    return res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const deleteUserController = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "You have to pass id for deleting user" });
  }

  try {
    await deleteUserService(Number(id));
    res.status(200).json({ message: `User ${id} was deleted` });
  } catch (error) {
    next(error);
  }
};
