import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { corsConfig } from './config/cors.config.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(corsConfig());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req?.method} request for ${req?.url}`);
  next();
});

//? Error Handling
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Search service is running on Port:${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    `Unhandled Rejection at: ${promise}, reason: ${
      reason instanceof Error ? reason.stack : JSON.stringify(reason)
    }`
  );
  process.exit(1);
});
