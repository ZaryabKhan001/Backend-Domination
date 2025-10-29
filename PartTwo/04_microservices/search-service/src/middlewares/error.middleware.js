import { logger } from '../utils/logger.js';

export const globalErrorHandler = async (err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.path}`, {
    message: err?.message,
    stack: err?.stack,
  });

  const status = err?.status || 500;
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error';

  return res.status(status).json({
    success: false,
    message: message,
  });
};
