import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../config/redis.config.js';

export const rateLimiter = (maxRequests, duration) => {
  return rateLimit({
    limit: maxRequests,
    windowMs: duration,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded.');
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    },
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
  });
};
