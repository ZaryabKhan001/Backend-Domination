import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { corsConfig } from './config/cors.config.js';
import { connectDb } from './database/connectDb.js';
import { redisClient } from './config/redis.config.js';
import helmet from 'helmet';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { routeRateLimiter } from './middlewares/rateLimiter.middleware.js';
import authRouter from './routes/identityService.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || process.env.BACKUP_PORT;

connectDb();

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

//? DDOSS Protection and rate limiting
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware', // key which tell us rate limiting
  points: 100, // max calls
  duration: 1, // 1 second
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for ${req.ip}`);
      return res.status(429).json({
        success: false,
        message: 'Too many requests',
      });
    });
});

//? Endpoints rate limiting
app.use('/api/auth/register', routeRateLimiter);

//? Routes
app.use('/api/auth', authRouter);

//? Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Identity Service running on Port: ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection on', promise, 'with reason:', reason);
  process.exit(1); 
});
