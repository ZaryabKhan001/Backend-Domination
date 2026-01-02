import { logger } from '../utils/logger.js';
import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Access attempt without valid Authorization header');
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Missing or invalid token format',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Access without valid token');
    return res.status(401).json({
      success: false,
      message: 'Autentication Failed',
    });
  }
  req.token = token;
  next();
};

export const verifyToken = (req, res, next) => {
  const token = req.token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch (error) {
    logger.warn(`JWT verification failed: ${error?.message}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
