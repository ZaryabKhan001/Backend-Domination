import { logger } from '../utils/logger.js';

export const globalErrorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  res.status(err?.status || 500).json({
    success: err?.success || false,
    message: err?.message || 'Internal Server Error',
  });
};
