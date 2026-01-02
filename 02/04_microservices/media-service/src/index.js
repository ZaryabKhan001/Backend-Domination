import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import { globalErrorHandler } from './middlewares/errorHandler.middleware.js';
import mediaRouter from './routes/media.routes.js';
import helmet from 'helmet';
import { connectDb } from './database/connectDb.js';
import { rateLimiter } from './middlewares/rateLimiter.middleware.js';
import { connectRabbitMQ, consumeEvent } from './utils/rabbitmq.js';
import { handleDeleteMedia } from './events/media.events.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDb();

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req?.method} request for ${req?.url}`);
  next();
});

// Route based rate limiting
app.use('/api/media/upload', rateLimiter(1 * 60 * 100, 25));

//? Routes
app.use('/api/media', mediaRouter);

//? global Error Handler
app.use(globalErrorHandler);

const startServer = async () => {
  try {
    await connectRabbitMQ();

    //? consume events
    await consumeEvent('post.deleted', handleDeleteMedia);

    app.listen(port, () => {
      logger.info(`Media Service is running on Port: ${port}`);
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
