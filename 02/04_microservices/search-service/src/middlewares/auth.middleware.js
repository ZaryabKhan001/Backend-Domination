import { logger } from '../utils/logger.js';

export const validateRequest = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    logger.warn('Not Authentication. Login required.');
    return res.status(404).json({
      success: false,
      message: 'Not Authentication. Login required.',
    });
  }
  req.user = { userId };
  next();
};
