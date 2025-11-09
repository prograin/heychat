// ---------------

export const errorHandler = (error, req, res, next) => {
  const error_status = error.status || 500;
  const error_message = error.message || "An unexpected error occurred";

  res.status(error_status).json({ message: error_message });
};
