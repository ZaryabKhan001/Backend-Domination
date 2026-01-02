import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import { dbConnect } from './database/dbConnect.js';
import helmet from 'helmet';
import { globalErrorHandler } from './middlewares/errorHandler.middleware.js';
import postRouter from './routes/post.route.js';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from './config/redis.config.js';
import { connectRabbitMQ } from './utils/rabbitmq.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

dbConnect();

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

//? DDOS Protection and rate limiting
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 1,
  keyPrefix: 'post-service',
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

//? Endpoints
app.use('/api/post', postRouter);

//? Error Handling
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectRabbitMQ();
    app.listen(port, () => {
      logger.info(`Post Service is running on Port: ${port}`);
    });
  } catch (error) {
    logger.error('Error in Starting Server', error);
    process.exit(1);
  }
};
startServer();

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise}, reason: ${
      reason instanceof Error ? reason.stack : JSON.stringify(reason)
    }`
  );
  process.exit(1);
});
