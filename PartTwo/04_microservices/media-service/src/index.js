import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import { globalErrorHandler } from './middlewares/errorHandler.middleware.js';
import mediaRouter from './routes/media.routes.js';
import helmet from 'helmet';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  logger.info(`Request body ${req.body}`);
  next();
});

//? Routes
app.use('/api/media', mediaRouter);

//? global Error Handler
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Media Service is running on Port: ${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise}, reason: ${
      reason instanceof Error ? reason.stack : JSON.stringify(reason)
    }`
  );
  process.exit(1);
});
