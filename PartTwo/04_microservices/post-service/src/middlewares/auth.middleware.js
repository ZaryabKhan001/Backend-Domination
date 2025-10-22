import { logger } from '../utils/logger.js';

export const authenticateRequest = async (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    logger.warn('Attempting Post Creation Without Authentication');
    return res.status(400).json({
      success: false,
      message: 'Authentication Required, Please login to continue',
    });
  }

  req.user = { userId };
  next();
};
