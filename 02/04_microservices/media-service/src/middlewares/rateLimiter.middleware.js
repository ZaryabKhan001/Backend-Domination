import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../config/redis.config.js';
import { logger } from '../utils/logger.js';

export const rateLimiter = (duration, limit) => {
  return rateLimit({
    windowMs: duration,
    max: limit,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded for this route');
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    },
    store: new RedisStore({
      sendCommand: (command, ...args) => redisClient.call(command, ...args),
    }),
  });
};
